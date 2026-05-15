import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class progressBar implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private mainContainer: HTMLDivElement;
    private progressLabel: HTMLLabelElement;
    private progressBar: HTMLProgressElement;

    private funcNotifyOutputChanged: () => void;

    private progressIncrement: () => void;

    private progressNum: number;
    private progressMax: number;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        // Add control initialization code
        const _value: number = context.parameters.progress.raw || 0;

        this.funcNotifyOutputChanged = notifyOutputChanged;

        this.mainContainer = document.createElement("div");
        this.progressBar = document.createElement("progress");
        this.progressLabel = document.createElement("label");

        // mainContainerのidを設定
        this.mainContainer.id = "mainContainer";

        // progressLabelの初期値を設定
        this.progressLabel.innerText = "0";
        this.progressLabel.id = "p-label";
        // progressBarの初期値を設定
        this.progressBar.value = 0;
        this.progressBar.max = 100;
        this.progressBar.id = "p-bar";

        // mainContainerに追加
        this.mainContainer.appendChild(this.progressLabel);
        this.mainContainer.appendChild(this.progressBar);

        const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒


        // プログレスバーの値の増加の関数を代入
        this.progressIncrement = async () => {
            if (_value <= 100 && _value >= 0) {
                this.progressMax = Math.ceil(_value);
                for (let i = 0; i <= this.progressMax; i++) {
                    this.progressBar.value = i;
                    this.progressLabel.innerHTML = i.toString() + "%";
                    // バーに動きを見せるためループ毎に0.01秒待機
                    await sleep(0.01);
                }
                this.progressLabel.style.color = "#000000";
                
            }
            else if (_value < 0)
            {
                this.progressBar.value = 0;
                this.progressLabel.innerHTML = "0%↓";
                this.progressLabel.style.color = "#0000DD";
                return
            }
            else if (_value > 100)
            {
                this.progressBar.value = 100;
                this.progressLabel.innerHTML = _value + "%";
                this.progressLabel.style.color = "#FF0000";
                return
            }
            else
            {
                return
            }
        };

        //イベントを追加
        this.progressBar.addEventListener("onLoad", () => {
            this.progressIncrement();
        });

        // containerに追加
        container.appendChild(this.mainContainer);

        // notifyOutputChangedを介して、getOutput()を呼ぶ
        this.funcNotifyOutputChanged();
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        const _value: number = context.parameters.progress.raw || 0;
        const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));//timeはミリ秒

        this.progressIncrement = async () => {
            if (_value <= 100 && _value >= 0) {
                this.progressMax = Math.ceil(_value);
                for (let i = 0; i <= this.progressMax; i++) {
                    this.progressBar.value = i;
                    this.progressLabel.innerHTML = i.toString() + "%";
                    await sleep(0.01);
                }
                this.progressLabel.style.color = "#000000";
            }
            else if (_value < 0)
            {
                this.progressBar.value = 0;
                this.progressLabel.innerHTML = "0%↓";
                this.progressLabel.style.color = "#0000DD";
                return
            }
            else if (_value > 100)
            {
                this.progressMax = 100;
                for (let i = 0; i <= this.progressMax; i++) {
                    this.progressBar.value = i;
                    this.progressLabel.innerHTML = i.toString() + "%";
                    await sleep(0.01);
                }
                this.progressLabel.innerHTML = "100%↑";
                this.progressLabel.style.color = "#CC0000";
            }
            else
            {
                return
            }
        };
        this.progressIncrement();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            progress: this.progressBar.value
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
