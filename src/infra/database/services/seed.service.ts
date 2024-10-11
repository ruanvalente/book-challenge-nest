import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from 'src/modules/authors/entities/author.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderedItem } from 'src/modules/orders/entities/ordered-item.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderedItem)
    private orderedItemRepository: Repository<OrderedItem>,
  ) {}

  async run() {
    const isSeedEnabled = process.env.NODE_ENV !== 'production';

    if (!isSeedEnabled) {
      console.log('Seed execution skipped in production environment');
      return;
    }

    await this.seedAuthors();
    await this.seedBooks();
    await this.seedOrders();
  }

  private async seedAuthors() {
    const existingAuthors = await this.authorRepository.find();
    if (existingAuthors.length > 0) {
      console.log('Authors already exist, skipping seed.');
      return;
    }

    const authors = [
      {
        name: 'J.K. Rowling',
        bio: 'Author of Harry Potter',
        birthDate: '1965-07-31',
      },
      {
        name: 'George R. R. Martin',
        bio: 'Author of A Song of Ice and Fire',
        birthDate: '1948-09-20',
      },
    ];

    for (const author of authors) {
      const newAuthor = this.authorRepository.create(author);
      await this.authorRepository.save(newAuthor);
    }

    console.log('Authors seed completed');
  }

  private async seedBooks() {
    const existingBooks = await this.bookRepository.find();
    if (existingBooks.length > 0) {
      console.log('Books already exist, skipping seed.');
      return;
    }

    const authors = await this.authorRepository.find();
    if (authors.length === 0) {
      throw new Error('No authors found, seed authors first.');
    }

    const books = [
      {
        title: "Harry Potter and the Philosopher's Stone",
        isbn: '9780747532699',
        price: 39.9,
        category: 'Fantasy',
        stock: 50,
        description: 'The first book in the Harry Potter series.',
      },
      {
        title: 'A Game of Thrones',
        isbn: '9780553593716',
        price: 49.9,
        category: 'Fantasy',
        stock: 30,
        description: 'The first book in A Song of Ice and Fire series.',
      },
    ];

    for (const bookData of books) {
      const book = this.bookRepository.create(bookData);
      book.authors = authors;
      await this.bookRepository.save(book);
    }

    console.log('Books seed completed');
  }

  private async seedOrders() {
    const existingOrders = await this.orderRepository.find();
    if (existingOrders.length > 0) {
      console.log('Orders already exist, skipping seed.');
      return;
    }

    const books = await this.bookRepository.find();
    if (books.length === 0) {
      throw new Error('No books found, seed books first.');
    }

    const order = this.orderRepository.create({ client: 'John Doe' });
    const savedOrder = await this.orderRepository.save(order);

    const orderedItems = books.map((book) => {
      return this.orderedItemRepository.create({
        order: savedOrder,
        book,
        quantity: 2,
        priceUnitary: book.price,
      });
    });

    await this.orderedItemRepository.save(orderedItems);

    savedOrder.orderItems = orderedItems;
    savedOrder.calculateAmountValue();
    await this.orderRepository.save(savedOrder);

    console.log('Orders seed completed');
  }
}
