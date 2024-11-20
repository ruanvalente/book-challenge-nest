import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
  private readonly logger = new Logger(OrdersService.name);

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
    try {
      const { client, orderItems } = data;

      let order = this.orderRepository.create({ client });
      order = await this.orderRepository.save(order);

      const orderedItems = await Promise.all(
        orderItems.map(async (item) => {
          const book = await this.bookRepository.findOne({
            where: { id: item.bookId },
          });

          if (!book) {
            throw new NotFoundException(
              `Book with ID ${item.bookId} not found`,
            );
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
    } catch (error) {
      this.logger.error('Erro ao criar pedido', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o pedido. Tente novamente mais tarde.',
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    currentPage: number = 1,
  ): Promise<{
    data: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const [data, total] = await this.orderRepository.findAndCount({
        relations: ['orderItems', 'orderItems.book'],
        take: limit,
        skip: (page - 1) * limit,
        order: { orderDateTime: 'DESC' },
      });

      const totalPages: number = Math.ceil(total / limit);
      return { data, total, currentPage, totalPages };
    } catch (error) {
      this.logger.error('Erro ao buscar pedidos', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os pedidos. Tente novamente mais tarde.',
      );
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.book'],
      });

      if (!order) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
      }

      return order;
    } catch (error) {
      this.logger.error(`Erro ao buscar o pedido com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o pedido. Tente novamente mais tarde.',
      );
    }
  }

  async update(id: number, data: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.book'],
      });

      if (!order) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
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
    } catch (error) {
      this.logger.error(`Erro ao atualizar pedido com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o pedido. Tente novamente mais tarde.',
      );
    }
  }

  private async updateOrderItem(
    item: any,
    order: Order,
    bookMap: Map<number, Book>,
  ): Promise<void> {
    try {
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
    } catch (error) {
      this.logger.error('Erro ao atualizar item do pedido', error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderItems', 'orderItems.book'],
      });

      if (!order) {
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
      }

      await Promise.all(
        order.orderItems.map(async (orderedItem) => {
          const book = orderedItem.book;
          book.stock += orderedItem.quantity;
          await this.bookRepository.save(book);
        }),
      );

      await this.orderedItemRepository.delete({
        order: { id },
      });
      await this.orderRepository.delete(id);
    } catch (error) {
      this.logger.error(`Erro ao remover pedido com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao remover o pedido. Tente novamente mais tarde.',
      );
    }
  }
}
