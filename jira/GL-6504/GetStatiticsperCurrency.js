/*
	Created: 20251203@Eddie
	Task: Get statistics per Currency for Plinko X [GL-6504]
*/

/* VG: l2_pro, SG: l1_pro */

l2_pro.minigame.ticket_silos.aggregate([
    {
        $match: {
            time: { $gte: ISODate("2025-11-18"), $lt: ISODate("2025-12-02") },
            currency: { $ne: "UUS" },
            gameId: { $eq: 159 }
        }
    },
	{
		$group: {
			_id: "$currency",
			MinBetAmount: {$min: "$USD.stake"},
			AvgBetAmount: {$avg: "$USD.stake"} // Get AvgBetAmount
		}
	},
	/* Get tickets with ( BetAmount = Min BetAmount ) */
	{
		$lookup: {
			from: "ticket_silos",
			let: { currency: "$_id", minBet: "$MinBetAmount" },
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{ $eq:  ["$currency", "$$currency"] },
								{ $eq:  ["$gameId", 159] },
								{ $eq:  ["$USD.stake", "$$minBet"] },
								{ $gte: ["$time", ISODate("2025-11-18")]},
								{ $lt:  ["$time", ISODate("2025-12-02")]}
							]
						}
					}
				},
				{
					$count: "NumofTickets"
				}
			],
			as: "result"
		}
	},
	{
		$project: {
			_id: 0,
			currency: "$_id",
			AvgBetAmount: { $toDouble: { $round: ["$AvgBetAmount", 4] } },
			MinBetAmount: { $toDouble: { $round: ["$MinBetAmount", 4] } },
			NumofTickets: { $arrayElemAt: ["$result.NumofTickets", 0] }
		}
	},
	{
		$sort: { currency : 1 }
	}
])