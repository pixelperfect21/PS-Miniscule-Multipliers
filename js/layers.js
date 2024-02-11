addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = buyableEffect('p', 12)
        if (hasUpgrade('p', 12)) {mult = mult.mul(1.5)}
        if (hasUpgrade('p', 14)) {mult = mult.mul(upgradeEffect('p', 14))}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {if(hasMilestone('t', 0)) return new Decimal(1)},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Basic Multiplier",
            display() { return "Multiplying points by x" + format(buyableEffect('p', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('p', this.id).plus(1).log10().plus(1)
            },
            cost() {
                return getBuyableAmount('p', this.id).plus(1).pow(1.1)
            }
        },
        12: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Prestige Multiplier",
            display() { return "Multiplying prestige points by x" + format(buyableEffect('p', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('p', this.id).plus(1).log(8).plus(1)
            },
            cost() {
                return getBuyableAmount('p', this.id).pow(1.1).plus(5)
            }
        },
    },
    upgrades: {
        11: {
            title: "Basic Upgrade",
            description: "Multiply points by 2.",
            cost: new Decimal(10)
        },
        12: {
            title: "Basic Prestige Upgrade",
            description: "Multiply prestige points by 1.5.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade('p', 11)}
        },
        13: {
            title: "Self Boosting",
            description: () => "Multiply points based on points. Effect: x" + format(upgradeEffect('p', 13)),
            cost: new Decimal(40),
            unlocked() {return hasUpgrade('p', 12)},
            effect() {
                return player.points.plus(1).log(15).plus(1)
            }
        },
        14: {
            title: "Pointstige Boost",
            description: () => "Multiply prestige points based on points. Effect: x" + format(upgradeEffect('p', 14)),
            cost: new Decimal(75),
            unlocked() {return hasUpgrade('p', 13)},
            effect() {
                return player.points.plus(1).log(100).plus(1)
            }
        },
        15: {
            title: "New Layer!",
            description: () => "Unlock a new layer! This upgrade will also multiply prestige points based on prestige points. Effect: x" + format(upgradeEffect('p', 15)),
            cost: new Decimal(150),
            unlocked() {return hasUpgrade('p', 14)},
            effect() {
                return player.p.points.plus(1).log(75).plus(1)
            }
        },
    },
    autoUpgrade: () => hasMilestone('s', 1),
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "You have " + format(player.points) + " points"],
        "blank",
        ["display-text", () => "Your prestige points are multiplying points by x" + format(player.p.points.plus(1).mul(player.s.points.plus(1).mul(10).log(5).plus(1).log(5).plus(1)).log10().plus(1).log10().plus(1))],
        ["display-text", "Note: All buyables cost the layer's main currency unless specified"],
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],
})
addLayer("s", {
    name: "sacrifice", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#9C27B0",
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "sacrifice points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('s', 11)) {mult = mult.mul(5)}
        if (hasUpgrade('m', 31)) {mult = mult.mul(upgradeEffect('m', 31))}
        mult = mult.mul(buyableEffect('s', 13))
        mult = mult.mul(buyableEffect('b', 22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoUpgrade: () => hasMilestone('t', 0),
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for sacrifice points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('p', 15) || player.s.points.gte(1) || hasUpgrade('s', 11) || player.b.points.gte(1)},
    branches: ['p'],
    milestones: {
        0: {
            requirementDescription: "5 sacrifice points",
            effectDescription: "Unlock the Magnet layer and sacrifice upgrades",
            done() { return player.s.points.gte(5) || hasMilestone('b', 0)}
        },
        1: {
            requirementDescription: "100 sacrifice points",
            effectDescription: "Autobuy Prestige upgrades",
            done() { return player.s.points.gte(100) || hasMilestone('b', 0)}
        },
        2: {
            requirementDescription: "2500 sacrifice points",
            effectDescription: "Unlock Bricks",
            done() { return player.s.points.gte(2500) }
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Sacrifice Prestige Multiplier",
            display() { return "Multiplying prestige points by x" + format(buyableEffect('s', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('s', this.id).mul(6.25).plus(1).log10().plus(1)
            },
            cost() {
                return getBuyableAmount('s', this.id).plus(1).pow(1.1).plus(4)
            },
            unlocked() {return hasMilestone('s', 0)}
        },
        12: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Sacrifice Magnet Multiplier",
            display() { return "Multiplying magnets by x" + format(buyableEffect('s', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('s', this.id).mul(25).sqrt().plus(1)
            },
            cost() {
                return getBuyableAmount('s', this.id).plus(1).pow(1.1).plus(4)
            },
            unlocked() {return hasMilestone('s', 0)}
        },
        13: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Sacrifice Multiplier",
            display() { return "Multiplying sacrifice points by x" + format(buyableEffect('s', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('s', this.id).mul(5).sqrt().plus(1)
            },
            cost() {
                return getBuyableAmount('s', this.id).plus(1).pow(1.1).plus(49)
            },
            unlocked() {return hasUpgrade('s', 14) || hasMilestone('b', 1)}
        },
    },
    upgrades: {
        11: {
            title: "Basic Sacrifice Upgrade",
            description: "Multiply sacrifice points by 5.",
            cost: new Decimal(10),
            unlocked() {return hasMilestone('s', 0)}
        },
        12: {
            title: "Basic Magnetic Upgrade",
            description: "Multiply magnet gain by 5.",
            cost: new Decimal(25),
            unlocked() {return hasUpgrade('s', 11)}
        },
        13: {
            title: "Stronger Magnets",
            description: () => "Multiply magnets based on sacrifice points, and unlock new magnet upgrades.\nEffect: x" + format(upgradeEffect('s', 13)),
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('s', 12)},
            effect() {
                return player.s.points.sqrt().mul(1.5)
            }
        },
        14: {
            title: "Stronger Sacrifices",
            description: () => "Multiply sacrifice points based on sacrifice points, and unlock a new sacrifice buyable.\nEffect: x" + format(upgradeEffect('s', 14)),
            cost: new Decimal(75),
            unlocked() {return hasUpgrade('s', 13)},
            effect() {
                return player.s.points.root(4).mul(1.5)
            }
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "You have " + format(player.p.points) + " prestige points"],
        "blank",
        ["display-text", () => "Your sacrifice points are multiplying prestige points in the prestige point effect by x" + format(player.s.points.plus(1).mul(10).log(5).plus(1).log(5).plus(1))],
        "blank",
        "milestones",
        "blank",
        "buyables",
        "blank",
        "upgrades",
    ],
})
addLayer("m", {
    name: "magnets", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#C62828",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "magnets", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('m', 12)) {mult = mult.mul(upgradeEffect('m', 12))}
        if (hasUpgrade('m', 22)) {mult = mult.mul(upgradeEffect('m', 22))}
        if (hasUpgrade('s', 12)) {mult = mult.mul(5)}
        if (hasUpgrade('s', 13)) {mult = mult.mul(upgradeEffect('s', 13))}
        if (hasUpgrade('m', 32)) {mult = mult.mul(upgradeEffect('m', 32))}
        mult = mult.mul(buyableEffect('s', 12))
        mult = mult.mul(buyableEffect('b', 23))
        if (hasUpgrade('m', 42)) {mult = mult.mul(upgradeEffect('m', 42))}
        if (hasUpgrade('m', 52)) {mult = mult.mul(upgradeEffect('m', 52))}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoUpgrade: () => hasMilestone('t', 0),
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasMilestone('s', 0)},
    branches: ['s'],
    passiveGeneration() {return new Decimal(1)},
    upgrades: {
        11: {
            title: "Attract I",
            description() {return "Multiply points based on magnets\nEffect: " + format(upgradeEffect('m', 11))},
            cost: new Decimal(60),
            effect() {
                return player.m.points.plus(1).log10().plus(1)
            }
        },
        12: {
            title: "Repel I",
            description() {return "Multiply magnets based on points\nEffect: " + format(upgradeEffect('m', 12))},
            cost: new Decimal(60),
            effect() {
                return player.points.plus(1).log10().plus(1)
            }
        },
        21: {
            title: "Attract II",
            description() {return "Multiply prestige points based on magnets\nEffect: " + format(upgradeEffect('m', 21))},
            cost: new Decimal(300),
            effect() {
                return player.m.points.plus(1).log(15).plus(1)
            }
        },
        22: {
            title: "Repel II",
            description() {return "Multiply magnets based on prestige points\nEffect: " + format(upgradeEffect('m', 22))},
            cost: new Decimal(300),
            effect() {
                return player.p.points.plus(1).log(5).plus(1)
            }
        },
        31: {
            title: "Attract III",
            description() {return "Multiply sacrifice points based on magnets\nEffect: " + format(upgradeEffect('m', 31))},
            cost: new Decimal(1e5),
            effect() {
                return player.m.points.plus(1).log(50).plus(1)
            },
            unlocked() {return hasUpgrade('s', 13) || hasMilestone('b', 1)}
        },
        32: {
            title: "Repel III",
            description() {return "Multiply magnets based on sacrifice points\nEffect: " + format(upgradeEffect('m', 32))},
            cost: new Decimal(1e5),
            effect() {
                return player.s.points.plus(1).log(5).plus(1)
            },
            unlocked() {return hasUpgrade('s', 13) || hasMilestone('b', 1)}
        },
        41: {
            title: "Attract IV",
            description() {return "Multiply bricks based on magnets\nEffect: " + format(upgradeEffect('m', 41))},
            cost: new Decimal(1e8),
            effect() {
                return player.m.points.plus(1).log(25).plus(1)
            },
            unlocked() {return hasMilestone('b', 1)}
        },
        42: {
            title: "Repel IV",
            description() {return "Multiply magnets based on bricks\nEffect: " + format(upgradeEffect('m', 42))},
            cost: new Decimal(1e8),
            effect() {
                return player.b.bricks.plus(1).log(5).plus(1)
            },
            unlocked() {return hasMilestone('b', 1)}
        },
        51: {
            title: "Attract V",
            description() {return "Multiply tires based on magnets\nEffect: " + format(upgradeEffect('m', 51))},
            cost: new Decimal(1e11),
            effect() {
                return player.m.points.plus(1).log(100).plus(1)
            },
            unlocked() {return hasMilestone('t', 0)}
        },
        52: {
            title: "Repel V",
            description() {return "Multiply magnets based on tires\nEffect: " + format(upgradeEffect('m', 52))},
            cost: new Decimal(1e11),
            effect() {
                return player.t.points.plus(1).log(25).plus(1)
            },
            unlocked() {return hasMilestone('t', 0)}
        },
    },
    tabFormat: [
        "main-display",
        "blank",
        ["display-text", () => "You are gaining " + format(tmp.m.gainMult) + " magnets per second"],
        "blank",
        "upgrades"
    ],
})
addLayer("b", {
    name: "bricks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        bricks: new Decimal(0),
    }},
    color: "#FBC02D",
    requires: new Decimal(2500), // Can be a function that takes requirement increases into account
    resource: "brick power", // Name of prestige currency
    baseResource: "sacrifice points", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.9, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.b.points.gte(1)},
    branches: ['s'],
    brickMult() {
        let mult = player.b.points.pow(1.5)
        mult = mult.mul(buyableEffect('b', 11))
        mult = mult.mul(buyableEffect('b', 12))
        if (hasUpgrade('m', 41)) {mult = mult.mul(upgradeEffect('m', 41))}
        mult = mult.mul(buyableEffect('b', 31))
        return mult
    },
    update(diff) {
        let gain = tmp.b.brickMult
        gain = gain
        player.b.bricks = player.b.bricks.add(gain.mul(diff))
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "You have " + format(player.points) + " points"],
        ["display-text", () => "You have " + format(player.m.points) + " magnets"],
        ["display-text", () => "You have " + format(player.s.points) + " sacrifice points"],
        "blank",
        ["display-text", () => "You are gaining " + format(tmp.b.brickMult) + " bricks/s (Base: " + format(player.b.points.pow(1.5))+ "/s)"],
        ["display-text", () => "Your brick power has generated " + format(player.b.bricks) + " bricks"],
        "blank",
        "milestones",
        "buyables",
        "blank",
    ],
    hotkeys: [
        {key: "b", description: "B: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "1 brick power",
            effectDescription: "Keep sacrifice milestones 1 and 2 on brick reset, and always unlock sacrifice buyable 3, \"Attract III \", and \"Repel III\".",
            done() { return player.b.points.gte(1) }
        },
        1: {
            requirementDescription: "5 brick power",
            effectDescription: "Unlock Brick Charge and 2 new Magnet upgrades",
            done() { return player.b.points.gte(5) }
        },
        2: {
            requirementDescription: "1e9 bricks",
            effectDescription: "Unlock Tires",
            done() { return player.b.bricks.gte(1e9) }  
        }
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Point Brick Multiplier",
            display() { return "Multiplying bricks by x" + format(buyableEffect('b', this.id)) + "\nCost: " + format(this.cost()) + " points"},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('b', this.id).div(10).plus(1)
            },
            cost() {
                return getBuyableAmount('b', this.id).mul(9).plus(1).pow(1.5)
            },
        },
        12: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Magnet Brick Multiplier",
            display() { return "Multiplying bricks by x" + format(buyableEffect('b', this.id)) + "\nCost: " + format(this.cost()) + " magnets"},
            canAfford() { return player.m.points.gte(this.cost()) },
            buy() {
                player.m.points = player.m.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('b', this.id).mul(2).div(10).plus(1)
            },
            cost() {
                return getBuyableAmount('b', this.id).plus(1).mul(10).pow(3)
            },
        },
        21: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Brick Point Multiplier",
            display() { return "Multiplying points by x" + format(buyableEffect('b', this.id)) + "\nCost: " + format(this.cost()) + " bricks"},
            canAfford() { return player.b.bricks.gte(this.cost()) },
            buy() {
                player.b.bricks = player.b.bricks.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('b', this.id).mul(4).div(5).plus(1)
            },
            cost() {
                return getBuyableAmount('b', this.id).mul(9).plus(1).pow(getBuyableAmount('b', this.id).div(100).plus(1.1))
            },
        },
        22: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Brick Sacrifice Multiplier",
            display() { return "Multiplying sacrifice points by x" + format(buyableEffect('b', this.id)) + "\nCost: " + format(this.cost()) + " bricks"},
            canAfford() { return player.b.bricks.gte(this.cost()) },
            buy() {
                player.b.bricks = player.b.bricks.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('b', this.id).mul(2).div(10).plus(1)
            },
            cost() {
                return getBuyableAmount('b', this.id).mul(9).plus(1).pow(getBuyableAmount('b', this.id).div(100).plus(1.1))
            },
        },
        23: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Brick Magnet Multiplier",
            display() { return "Multiplying magnets by x" + format(buyableEffect('b', this.id)) + "\nCost: " + format(this.cost()) + " bricks"},
            canAfford() { return player.b.bricks.gte(this.cost()) },
            buy() {
                player.b.bricks = player.b.bricks.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('b', this.id).mul(2).div(10).plus(1)
            },
            cost() {
                return getBuyableAmount('b', this.id).mul(9).plus(1).pow(getBuyableAmount('b', this.id).div(100).plus(1.1))
            },
        },
        31: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Brick Charge Multiplier",
            display() { return "Multiplying bricks by x" + format(buyableEffect('b', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                player.b.points = player.b.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(1.5).pow(getBuyableAmount('b', this.id))
            },
            cost() {
                return new Decimal(2).pow(getBuyableAmount('b', this.id))
            },
            unlocked() {
                return hasMilestone('b', 1)
            },
        },
    },
})
addLayer("t", {
    name: "tires", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resetsDone: new Decimal(0),
    }},
    color: "#546E7A",
    requires: new Decimal(250000), // Can be a function that takes requirement increases into account
    resource: "tires", // Name of prestige currency
    baseResource: "sacrifice points", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    tireMult() {
        mult = new Decimal(2)
        mult = mult.plus(buyableEffect('t', 11))
        return mult
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = tmp.t.tireMult.pow(player.t.resetsDone)
        if (hasUpgrade('m', 51)) {mult = mult.mul(upgradeEffect('m', 51))}
        return mult
    },
    doReset() {
        player.t.resetsDone = player.t.resetsDone.plus(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "t", description: "T: Reset for tires", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {return hasMilestone('b', 2)},
    branches: ['s'],
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", () => "You have " + format(player.s.points) + " sacrifice points"],
        "blank",
        ["display-text", () => "Tire gain: " + format(tmp.t.tireMult) + " base mult^" + format(player.t.resetsDone) + " resets done = " + format(tmp.t.tireMult.pow(player.t.resetsDone)) + " base tire gain"],    
        "blank",
        "milestones",
        "buyables",
    ],
    buyables: {
        11: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Tire Multiplier",
            display() { return "Adding " + format(buyableEffect('t', this.id)) + " to the tire multiplier\nCost: " + format(this.cost())},
            canAfford() { return player.t.points.gte(this.cost()) },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('t', this.id).div(100)
            },
            cost() {
                return new Decimal(2).plus(getBuyableAmount('t', this.id).div(100)).pow(getBuyableAmount('t', this.id))
            }
        },
        21: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Tire Sacrifice Multiplier",
            display() { return "Multiplying sacrifice points by x" + format(buyableEffect('t', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player.t.points.gte(this.cost()) },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('t', this.id).div(10).plus(1)
            },
            cost() {
                return new Decimal(2).pow(getBuyableAmount('t', this.id))
            }
        },
        22: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "Tire Brick Multiplier",
            display() { return "Multiplying bricks by x" + format(buyableEffect('t', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player.t.points.gte(this.cost()) },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return getBuyableAmount('t', this.id).div(10).plus(1)
            },
            cost() {
                return new Decimal(2).pow(getBuyableAmount('t', this.id))
            }
        },
        31: {
            cost(x) { return new Decimal(1).mul(x) },
            title: "The \"Miniscule\" Multiplier",
            display() { return "Multiplying points by x" + format(buyableEffect('t', this.id)) + "\nCost: " + format(this.cost())},
            canAfford() { return player.t.points.gte(this.cost()) },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(5).pow(getBuyableAmount('t', this.id))
            },
            cost() {
                return new Decimal(12.5).pow(getBuyableAmount('t', this.id).plus(7))
            }
        },
    },
    milestones: {
        0: {
            requirementDescription: "1000 tires",
            effectDescription: "Unlock 2 more Magnet Upgrades, passively generate Prestige Points, and autobuy Sacrifice and Magnet upgrades.",
            done() { return player.t.points.gte(1000) }
        },
        1: {
            requirementDescription: "1e9 tires",
            effectDescription: "Unlock a new buyable",
            done() { return player.t.points.gte(1e9) }
        },
    }
}) 