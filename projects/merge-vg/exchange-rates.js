{
  const db = l1ppp.minigame;
  const logger = (message) =>
    console.log(util.inspect(message, false, null, true));

  const latest = db.exchange_rates.findOne(
    {},
    { _id: 0 },
    { sort: { exId: -1 } }
  );
  latest.time = ISODate();
  latest.exDate = ISODate("2023-03-20T00:00:00Z");
  latest.exId++;
  latest.code = {
    ARS: Decimal128("0.00492"),
    AUD: Decimal128("0.67064"),
    BDT: Decimal128("0.00946"),
    BND: Decimal128("0.74565"),
    BRL: Decimal128("0.18947"),
    CAD: Decimal128("0.72826"),
    CHF: Decimal128("1.08025"),
    CLP: Decimal128("0.00121"),
    CNY: Decimal128("0.14522"),
    CZK: Decimal128("0.04448"),
    DKK: Decimal128("0.14332"),
    EUR: Decimal128("1.06677"),
    GBP: Decimal128("1.21897"),
    GHS: Decimal128("0.08115"),
    HKD: Decimal128("0.1274"),
    IDR: Decimal128("0.00006516"),
    INR: Decimal128("0.01212"),
    JPY: Decimal128("0.00759"),
    KES: Decimal128("0.0078"),
    KHR: Decimal128("0.00025"),
    KRW: Decimal128("0.00076"),
    KZT: Decimal128("0.0022"),
    LAK: Decimal128("0.00006"),
    MMK: Decimal128("0.00048"),
    MXN: Decimal128("0.05298"),
    MYR: Decimal128("0.22292"),
    NOK: Decimal128("0.09353"),
    NPR: Decimal128("0.00768"),
    PEN: Decimal128("0.26515"),
    PHP: Decimal128("0.01833"),
    PKR: Decimal128("0.00355"),
    PLN: Decimal128("0.22699"),
    RON: Decimal128("0.21688"),
    RUB: Decimal128("0.013"),
    SEK: Decimal128("0.09518"),
    THB: Decimal128("0.02944"),
    TRY: Decimal128("0.05264"),
    USD: Decimal128("1"),
    VND: Decimal128("0.00004241"),
    YNG: Decimal128("0.00004241"),
  };

  logger(latest);
  logger(db.exchange_rates.insertOne(latest));
}
