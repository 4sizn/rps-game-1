abstract class GameObject {
  //   private id: string | null = null;
  abstract init(): void;
  abstract update(): void;
}

export class CoinObject extends GameObject {
  constructor() {
    super();
  }
  init(): void {}
  update(): void {}
}
