import CustomScrollViewItem from "./Library/CustomScrollViewItem";
import TestScrollViewManager from "./TestScrollViewManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestItem extends CustomScrollViewItem {

    public get id(): string { return this.index.toFixed(); }

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Button)
    button: cc.Button = null;

    protected manager: TestScrollViewManager;

    public updateItem(index: number): void {
        super.updateItem(index);
        this.label.string = index.toFixed();
        this.updateColor();
    }

    public init(manager: TestScrollViewManager) {
        this.manager = manager;
        this.button.node.on("click", () => {
            cc.log(`click: ${this.index}`);
            manager.onClickItem(this);
            this.updateColor();
        });
    }

    public updateColor(): void {
        const isSelected: boolean = this.manager.isSelectedItem(this);
        this.button.target.color = isSelected ? cc.Color.RED : cc.Color.WHITE;
        cc.log(`index: ${this.index}, ${isSelected}, ${this.button.normalColor}`)
    }
}
