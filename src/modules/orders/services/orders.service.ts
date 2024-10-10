import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Book } from 'src/modules/books/entities/book.entity';
import { CreateOrderRequestDTO } from 'src/modules/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrderedItem } from '../entities/ordered-item.entity';
import { OrderValidation } from '../validations/orders.validations';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderedItem)
    private readonly orderedItemRepository: Repository<OrderedItem>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    private readonly orderValidation: OrderValidation,
  ) {}

  async create(data: CreateOrderRequestDTO): Promise<Order> {
    const { client, orderItems } = data;

    let order = this.orderRepository.create({ client });

    order = await this.orderRepository.save(order);

    const orderedItems = await Promise.all(
      orderItems.map(async (item) => {
        const book = await this.bookRepository.findOne({
          where: { id: item.bookId },
        });

        if (!book) {
          throw new NotFoundException(`Book with ID ${item.bookId} not found`);
        }

        book.stock -= item.quantity;
        await this.bookRepository.save(book);

        const orderedItem = this.orderedItemRepository.create({
          book,
          order,
          quantity: item.quantity,
          priceUnitary: item.priceUnitary,
        });

        return orderedItem;
      }),
    );

    order.orderItems = orderedItems;

    await this.orderedItemRepository.save(orderedItems);

    order.calculateAmountValue();

    await this.orderRepository.save(order);

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.book'],
    });

    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.book'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, data: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.book'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (data.client) {
      order.client = data.client;
    }

    if (data.orderItems) {
      const books = await this.bookRepository.findBy({
        id: In(data.orderItems.map((item) => item.bookId)),
      });
      const bookMap = new Map(books.map((book) => [book.id, book]));

      await Promise.all(
        data.orderItems.map((item) =>
          this.updateOrderItem(item, order, bookMap),
        ),
      );
    }

    order.calculateAmountValue();

    await this.orderRepository.save(order);

    return order;
  }

  private async updateOrderItem(
    item: any,
    order: Order,
    bookMap: Map<number, Book>,
  ): Promise<void> {
    const book = bookMap.get(item.bookId);

    if (!book) {
      throw new NotFoundException(`Book with ID ${item.bookId} not found`);
    }

    let orderedItem = order.orderItems.find(
      (orderItem) => orderItem.book.id === item.bookId,
    );

    this.orderValidation.checkStockAvailability(book);

    if (orderedItem) {
      this.orderValidation.validateStock(
        item.quantity,
        book.stock + orderedItem.quantity,
        book,
      );
      orderedItem.quantity = item.quantity;
      orderedItem.priceUnitary = item.priceUnitary;
      book.stock -= item.quantity;
    } else {
      this.orderValidation.validateStock(item.quantity, book.stock, book);
      orderedItem = this.orderedItemRepository.create({
        order: { id: order.id },
        book,
        quantity: item.quantity,
        priceUnitary: item.priceUnitary,
      });
      book.stock -= item.quantity;
    }
    orderedItem.order = { id: order.id } as Order;

    await Promise.all([
      this.bookRepository.save(book),
      this.orderedItemRepository.save(orderedItem),
    ]);
  }
}
