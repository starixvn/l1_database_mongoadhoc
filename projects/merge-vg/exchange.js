{
  const logger = (message) =>
    console.log(util.inspect(message, false, null, true));

  const coll = l2p.minigame.global_configs;
  const filter = { type: "exchange_codes" };

  const codes = [
    "ARS",
    "BDT",
    "BND",
    "BRL",
    "CHF",
    "CLP",
    "CZK",
    "DKK",
    "GHS",
    "INR",
    "KES",
    "KHR",
    "KZT",
    "LAK",
    "MMK",
    "MXN",
    "NOK",
    "NPR",
    "PEN",
    "PKR",
    "PLN",
    "RON",
    "RUB",
    "SEK",
    "TRY",
  ];
  logger(coll.findOne(filter));
  logger(
    coll.updateOne(filter, { $addToSet: { "configs.codes": { $each: codes } } })
  );
  logger(coll.findOne(filter));
}
