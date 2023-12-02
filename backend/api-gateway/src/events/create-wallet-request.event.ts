export class CreateWalletRequestEvent {
  constructor(
    public readonly eoaAddress: string,
    public readonly network: string,
  ) {}
}
