/**
 * Lines Manager for UI
 */
import Model from '../../core/Model';

export default class LinesManager{
    /**
     * Init Lines Manager
     * @param {Array} config of betlines
     * @param renderer PIXI
     * @param scene container to appear
     * @param reelset sprites of syms, needed for coordinates
     */
    constructor(config, renderer, scene, reelset){
        this.showTimes = [];
        this.lines = {};
        this.renderer = renderer;
        this._rootContainer = new renderer.Container();
        this._rootContainer.x = 195;//@TODO move to conf!
        this._rootContainer.y = 130;//@TODO move to conf!
        scene.addChild(this._rootContainer);
        this.reelSet = reelset;
        this.model = new Model();
        this.generateBetlines(config);
        this._generateAllWinContainer();
    }

    /**
     *
     * @private
     */
    _generateAllWinContainer(){
        let allWinContainer = new this.renderer.Container(),
            allWinBG = new this.renderer.Graphics(),
            allWinText = new this.renderer.Text('', {
                font: '35px Arial',//@TODO move to conf!
                fill: '#ff0000'//@TODO move to conf!
            });

        allWinBG.beginFill(0x99ff99, 0.5);
        allWinBG.drawRect(0,0,60,40);
        allWinBG.endFill();
        allWinBG = new this.renderer.Sprite(allWinBG.generateTexture());

        allWinContainer.addChild(allWinBG);
        allWinContainer.addChild(allWinText);

        allWinContainer.allText = allWinText;
        allWinContainer.x = 225;//@TODO move to conf!
        allWinContainer.y = 100;//@TODO move to conf!
        allWinContainer.visible = false;

        this._totalWin = allWinContainer;
        this._rootContainer.addChild(allWinContainer);

    }
    /**
     * Init Lines and show win labels for them
     * @param betlines
     */
    generateBetlines(betlines){
        for (let line of betlines){
            this._generateLine(line);
        }
    }

    /**
     * Generates a single line from virtual canvas
     * @param lineConf
     * @private
     */
    _generateLine(lineConf){
        let line = new this.renderer.Container(),
            lineGFX = new this.renderer.Graphics().lineStyle(3, 0x99ff99);//@TODO move to conf!
        line.num = lineConf.id;
        lineConf.cells.forEach((item, i, array)=>{
            let curSegment = this.reelSet[item.row][item.reel + 1],
                nextSegment;
            if (array[i+1] !== undefined){
                nextSegment = this.reelSet[array[i+1].row][array[i+1].reel + 1];
                lineGFX.moveTo(
                        curSegment.parent.x,
                        curSegment.y
                    );
                lineGFX.lineTo(
                        nextSegment.parent.x,
                        nextSegment.y
                    );
            }
        });
        line.addChild(new this.renderer.Sprite(lineGFX.generateTexture()));
        line.visible = false;
        if (line.num === 1){
            line.x = 250;//@TODO implement normal line generation!
        }
        this._rootContainer.addChild(line);
        this.lines[line.num] = line;
        this._generateLineLabel(line);
    }

    /**
     * Adding of Win field.
     * @param line container
     * @private
     */
    _generateLineLabel(line){
        let labelContainer = new this.renderer.Container(),
            labelBgGFX = new this.renderer.Graphics(),
            labelBg,
            labelText = new this.renderer.Text('', {
                font: '35px Arial',
                fill: '#ff0000'
            });

        labelBgGFX.beginFill(0x99ff99, 0.5);//@TODO move to conf!
        labelBgGFX.drawRect(0,0,60,40);//@TODO move to conf!
        labelBgGFX.endFill();

        labelBg = new this.renderer.Sprite(labelBgGFX.generateTexture());

        labelContainer.addChild(labelBg);
        labelContainer.addChild(labelText);

        labelContainer.x = (line.width / 2) - (labelBgGFX.width / 2);
        labelContainer.y = (line.height / 2) - (labelBgGFX.height / 2);
        line.labelContainer = labelContainer;
        line.labelText = labelText;
        line.addChild(labelContainer);
    }

    /**
     * @TODO implement in future
     * @param line
     * @private
     */
    _generateLineCaption(line){

    }

    /**
     * Shows bet lines single presentation
     * @param lines
     */
    showWinLinesSinglePresentation(lines){
        let linesIdx = 0;

        for (let line of lines){
            if(this.lines[line.lineId]){
                this.showTimes.push(setTimeout(()=>{
                    //Setting of label
                    this.lines[line.lineId].labelContainer.visible = true;
                    this.lines[line.lineId].labelText.text = line.win;
                    //Showing a single line
                    this.lines[line.lineId].visible = true;
                    this.showTimes.push(setTimeout(()=>{
                        this.lines[line.lineId].visible = false;
                    }, 1000)); //@TODO time move to conf
                },1000 * linesIdx));//@TODO time move to conf
                linesIdx++;
            } else {
                console.error('line with id ' + line.lineId + ' not found.');
            }
        }
    }

    /**
     * All lines show, then single line presentation show execution
     * @param lines
     * @param totalWin
     */
    showWinLines(lines, totalWin){
        new Promise((resolve)=>{
            if(lines.length > 1) {
                this._totalWin.allText.text = totalWin;
                this._totalWin.visible = true;
            }
            for (let line of lines){
                if(this.lines[line.lineId]){
                    if (lines.length > 1){
                        this.lines[line.lineId].labelContainer.visible = false;
                    } else {
                        this.lines[line.lineId].labelContainer.visible = true;
                        this.lines[line.lineId].labelText.text = line.win;
                    }
                    this.lines[line.lineId].visible = true;
                    this.showTimes.push(setTimeout(()=>{
                        this.lines[line.lineId].visible = false;
                        resolve();
                    }, 1000));
                }
            }
        })
        .then(()=>{
            if (lines.length > 1){
                this._totalWin.visible = false;
                this.showWinLinesSinglePresentation(lines);
            }
        })
    }

    /**
     * Stops betline win presentation
     */
    hideWinLines(){
        if (Object.keys(this.lines).length !== 0){
            for (let line in this.lines){
                this.lines[line].visible = false;
            }
        }
    }
}