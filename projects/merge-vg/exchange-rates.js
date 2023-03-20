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


{
  const db = l2_uat.minigame;
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
    ARS: Decimal128("116.17059"),
    AUD: Decimal128("15829.87683"),
    BDT: Decimal128("223.18337"),
    BND: Decimal128("17599.42946"),
    BRL: Decimal128("4471.64388"),
    CAD: Decimal128("17190.30094"),
    CHF: Decimal128("25492.96449"),
    CLP: Decimal128("28.49086"),
    CNY: Decimal128("3427.32898"),
    CZK: Decimal128("1049.90502"),
    DKK: Decimal128("3383.07294"),
    EUR: Decimal128("25180.5364"),
    GBP: Decimal128("28771.12082"),
    GHS: Decimal128("1914.83797"),
    HKD: Decimal128("3006.78551"),
    IDR: Decimal128("1.53777177"),
    INR: Decimal128("285.95014"),
    JPY: Decimal128("179.02455"),
    KES: Decimal128("184.05033"),
    KHR: Decimal128("5.92933"),
    KRW: Decimal128("18.04243"),
    KZT: Decimal128("51.8591"),
    LAK: Decimal128("1.41246"),
    MMK: Decimal128("11.38753"),
    MXN: Decimal128("1250.78125"),
    MYR: Decimal128("5260.98446"),
    NOK: Decimal128("2208.12496"),
    NPR: Decimal128("181.36044"),
    PEN: Decimal128("6256.77804"),
    PHP: Decimal128("432.53151"),
    PKR: Decimal128("83.77893"),
    PLN: Decimal128("5357.94409"),
    RON: Decimal128("5119.84545"),
    RUB: Decimal128("306.80208"),
    SEK: Decimal128("2247.52349"),
    THB: Decimal128("694.79006"),
    TRY: Decimal128("1242.24367"),
    USD: Decimal128("23600.75"),
    VND: Decimal128("1"),
    YNG: Decimal128("1"),
  };

  logger(latest);
  logger(db.exchange_rates.insertOne(latest));
}
