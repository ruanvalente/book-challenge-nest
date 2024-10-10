import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from 'src/modules/books/entities/book.entity';
import { CreateOrderRequestDTO } from 'src/modules/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrderedItem } from '../entities/ordered-item.entity';

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
    // 1. Buscar o pedido existente, incluindo os itens e os livros relacionados
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.book'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // 2. Atualizar as informações básicas do pedido (cliente, data, etc.)
    if (data.client) {
      order.client = data.client;
    }

    // 3. Atualizar os itens do pedido, se fornecidos no payload
    if (data.orderItems) {
      // 3.1. Iterar sobre os novos itens fornecidos
      const updatedOrderItems = await Promise.all(
        data.orderItems.map(async (item) => {
          // Verificar se o livro existe
          const book = await this.bookRepository.findOne({
            where: { id: item.bookId },
          });
          if (!book) {
            throw new NotFoundException(
              `Book with ID ${item.bookId} not found`,
            );
          }

          // Encontrar o item existente ou criar um novo
          let orderedItem = order.orderItems.find(
            (orderItem) => orderItem.book.id === item.bookId,
          );

          if (orderedItem) {
            // Atualizar quantidade e preço se o item já existir no pedido
            book.stock += orderedItem.quantity - item.quantity; // Ajustar o estoque do livro
            orderedItem.quantity = item.quantity;
            orderedItem.priceUnitary = item.priceUnitary;
          } else {
            // Criar um novo OrderedItem se ele não existir no pedido
            orderedItem = this.orderedItemRepository.create({
              order,
              book,
              quantity: item.quantity,
              priceUnitary: item.priceUnitary,
            });
            book.stock -= item.quantity;
          }

          // Salvar alterações do livro no banco
          await this.bookRepository.save(book);
          return orderedItem;
        }),
      );

      // 3.2. Atualizar a lista de itens no pedido
      order.orderItems = updatedOrderItems;
    }

    // 4. Calcular o valor total atualizado do pedido
    order.calculateAmountValue();

    // 5. Salvar o pedido atualizado no banco de dados
    await this.orderRepository.save(order);

    return order;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
