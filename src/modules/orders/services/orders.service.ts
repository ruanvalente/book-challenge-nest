import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Order } from '../entities/order.entity';
import { OrderedItem } from '../entities/ordered-item.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { CreateOrderRequestDTO } from 'src/modules/orders/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderedItem)
    private readonly orderedItemRepository: Repository<OrderedItem>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(data: CreateOrderRequestDTO): Promise<Order> {
    const { client, orderItems } = data;

    // Cria um novo pedido, sem definir os orderItems ainda
    let order = this.orderRepository.create({ client });

    // Salva o pedido no banco de dados para garantir que ele tenha um ID
    order = await this.orderRepository.save(order);

    // Agora que o pedido possui um ID, podemos associar os orderItems corretamente
    const orderedItems = await Promise.all(
      orderItems.map(async (item) => {
        const book = await this.bookRepository.findOne({
          where: { id: item.bookId },
        });

        if (!book) {
          throw new NotFoundException(`Book with ID ${item.bookId} not found`);
        }

        // Reduz o estoque do livro
        book.stock -= item.quantity;
        await this.bookRepository.save(book);

        // Cria um OrderedItem e associa corretamente o pedido já salvo
        const orderedItem = this.orderedItemRepository.create({
          book,
          order, // Associa o pedido já salvo aqui
          quantity: item.quantity,
          priceUnitary: item.priceUnitary,
        });

        return orderedItem;
      }),
    );

    // Atualiza o pedido com os itens de pedido criados
    order.orderItems = orderedItems;

    // Salva os OrderedItems no banco de dados
    await this.orderedItemRepository.save(orderedItems);

    // Calcula o valor total do pedido
    order.calculateAmountValue();

    // Salva o pedido com o valor total atualizado
    await this.orderRepository.save(order);

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.book'],
    });

    return orders;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
