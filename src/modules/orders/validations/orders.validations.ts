import { BadRequestException } from '@nestjs/common';

import { Book } from 'src/modules/books/entities/book.entity';

export class OrderValidation {
  requestQuantity: number;
  availableQuantity: number;
  book: Book;

  constructor(requestQuantity: number, availableQuantity: number, book: Book) {
    this.requestQuantity = requestQuantity;
    this.availableQuantity = availableQuantity;
    this.book = book;
  }

  validateStock(
    requestedQuantity: number,
    availableStock: number,
    book: Book,
  ): void {
    if (requestedQuantity > availableStock) {
      throw new BadRequestException(
        `The requested quantity (${requestedQuantity}) exceeds the available stock (${availableStock}) for the book "${book.title}". Price: $${book.price}`,
      );
    }
  }

  checkStockAvailability(book: Book): void {
    if (book.stock <= 0) {
      throw new BadRequestException(
        `Cannot proceed with the purchase for "${book.title}" as the stock is empty.`,
      );
    }
  }
}
