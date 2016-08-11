export let viewConfig = {
    reelsNum: 3,
    symsPerReel: 3,
    reelsWidth: 610,
    reelsHeight: 610,
    reelsPosition: {
        x: 68,
        y: 60,
        distanceBetween: 56
    },

    symbols: {
        distanceBetween: 30
    },

    spinButton: {
        position: {
            x: 862,
            y: 230
        }
    },

    text: {
        balance: {
            text: 'BALANCE:',
            position: {
                x: 850,
                y: 10
            },
            contentStyle: {
                font: '35px Arial',
                fill: '#ff0000'
            }
        },
        totalBet:{
            text: 'BET: ',
            position: {
                x: 850,
                y: 400
            }
        },
        totalWin:{
            text: 'WIN: ',
            position: {
                x: 850,
                y: 440
            }
        },
        rounds: {
            text: 'ROUND: ',
            position: {
                x: 850,
                y: 480
            }
        },
        style: {
            font: '24px Arial',
            fill: '#ff0000'
        }
    },

    betPanel: {
        x: 850,
        y: 120,
        labelOffset: 3,
        labelWidth: 40,
        betDelta: 10,
        maxBetPerLine: 100,
        captionOffset: 5
    },

    linesPanel: {
        x: 850,
        y: 185,
        labelOffset: 1,
        labelWidth: 20,
        linesDelta: 1,
        maxLines: 3,
        captionOffset: 5
    },

    responseActionDelay: 800
};