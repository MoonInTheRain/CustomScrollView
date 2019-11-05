import CustomScrollViewItem from "./CustomScrollViewItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomScrollViewManager extends cc.ScrollView {
    @property(cc.Node)
    public baseItem: cc.Node = null;

    @property
    public autoGenerate: boolean = false;

    @property(cc.Vec2)
    /** アイテムのサイズ */
    public itemSize: cc.Vec2 = new cc.Vec2(50, 50);

    @property(cc.Vec2)
    /** アイテム間の距離 */
    public itemOffset: cc.Vec2 = new cc.Vec2(10, 10);

    @property(cc.Vec2)
    /**
     * アイテムを並べた際のPadding
     * 現状、上下と左右は共通
     */
    public itemPadding: cc.Vec2 = new cc.Vec2(10, 10);

    @property(cc.Vec2)
    /** アイテムの実態の数 */
    public entityItemCount: cc.Vec2 = new cc.Vec2(3, 4);

    /** アイテムの実態のリスト */
    public eneityItemList: CustomScrollViewItem[] = [];

    /** 現在のIndex */
    private currentIndex: number = -1;

    /**
     * 表示させるアイテムの数。
     * 継承先でカスタマイズする。
     */
    public get itemCount(): number {
        return 100;
    }

    protected start(): void {
        super.start();
        this.init();
        this.updateAll();
    }

    protected init(): void {
        if ((this.horizontal && this.vertical) || (!this.horizontal && !this.vertical)) {
            cc.error("CustomScrollViewManager: 並びは縦か横、一方だけを選択する必要があります。縦方向として扱います");
            this.horizontal = false;
            this.vertical = true;
        }
        if (this.vertical) {
            this.content.anchorX = 0.5;
            this.content.anchorY = 1.0;
        } else {
            this.content.anchorX = 0.0;
            this.content.anchorY = 0.5;
        }

        this.eneityItemList = this.content.getComponentsInChildren(CustomScrollViewItem);

        if (this.autoGenerate) {
            if (this.baseItem == null) {
                cc.error("CustomScrollViewManager: AutoGenerateを有効にする場合、BaseItemを設定してください");
            } else {
                const entityItemCount = this.entityItemCount.x * this.entityItemCount.y;
                for (let index = this.eneityItemList.length; index < entityItemCount; index++) {
                    const newItem = cc.instantiate(this.baseItem);
                    this.eneityItemList.push(newItem.getComponent(CustomScrollViewItem));
                    this.content.addChild(newItem);
                }
            }
        } else if (this.eneityItemList.length !== this.entityItemCount.x * this.entityItemCount.y) {
            cc.error(
                `CustomScrollViewManager: content下のItemの数(${
                    this.eneityItemList.length
                })がentityItemCount(${this.entityItemCount.dot()})とあっていません。`
            );
        }

        this.eneityItemList.forEach(item => item.init(this));
    }

    protected updateAll(): void {
        this.setContentSize();
    }

    /**
     * スクロールのサイズを設定する。
     */
    private setContentSize(): void {
        if (this.vertical) {
            let height = Math.ceil(this.itemCount / this.entityItemCount.x);
            height *= this.itemSize.y + this.itemOffset.y;
            height += this.itemPadding.y * 2 - this.itemOffset.y;
            this.content.height = height;
        } else {
            let width = Math.ceil(this.itemCount / this.entityItemCount.y);
            width *= this.itemSize.x + this.itemOffset.x;
            width += this.itemPadding.x * 2 - this.itemOffset.x;
            this.content.width = width;
        }
    }

    protected update(dt): void {
        super.update(dt);

        let currentIndex = 0;
        if (this.vertical) {
            const y = this.content.y - this.content.parent.height / 2;
            currentIndex = Math.floor(y / (this.itemSize.y + this.itemOffset.y));
            currentIndex *= this.entityItemCount.x;
        } else {
            const x = this.content.x + this.content.parent.width / 2;
            currentIndex = Math.floor((x * -1) / (this.itemSize.x + this.itemOffset.x));
            currentIndex *= this.entityItemCount.y;
        }
        if (currentIndex >= 0 && currentIndex !== this.currentIndex) {
            cc.log(`new Index: ${currentIndex}`);
            this.updateIndex(currentIndex);
        }
    }

    protected updateIndex(newCurrentIndex: number): void {
        if (newCurrentIndex > this.currentIndex) {
            for (let index = 0; index < this.eneityItemList.length; index++) {
                const entityItem = this.eneityItemList[index];
                if (entityItem.index < newCurrentIndex) {
                    const newIndex = newCurrentIndex + this.eneityItemList.length - 1 - index;
                    entityItem.updateItem(newIndex);
                    this.setItemPosition(newIndex, entityItem);
                }
            }
        } else {
            //for (let index = this.eneityItemList.length - 1; index >= 0; index--) {
            for (let index = 0; index < this.eneityItemList.length; index++) {
                const entityItem = this.eneityItemList[this.eneityItemList.length - index - 1];
                if (entityItem.index >= newCurrentIndex + this.eneityItemList.length) {
                    const newIndex = newCurrentIndex + index;
                    entityItem.updateItem(newIndex);
                    this.setItemPosition(newIndex, entityItem);
                }
            }
        }
        this.eneityItemList = this.eneityItemList.sort((a, b) => a.index - b.index);
        this.currentIndex = newCurrentIndex;
    }

    private setItemPosition(index: number, item: CustomScrollViewItem): void {
        if (index >= this.itemCount) {
            item.node.active = false;
            return;
        }

        item.node.active = true;

        if (this.vertical) {
            const x = (index % this.entityItemCount.x) - this.entityItemCount.x / 2 + 0.5;
            const y = Math.floor(index / this.entityItemCount.x);
            item.node.x = x * (this.itemSize.x + this.itemOffset.x);
            item.node.y = y * (this.itemSize.y + this.itemOffset.y) * -1 - this.itemPadding.y - this.itemSize.y / 2;
            // cc.log(`set : ${index}`);
        } else {
            const x = Math.floor(index / this.entityItemCount.y);
            const y = (index % this.entityItemCount.y) - this.entityItemCount.y / 2 + 0.5;
            item.node.x = x * (this.itemSize.x + this.itemOffset.x) + this.itemPadding.x + this.itemSize.x / 2;
            item.node.y = y * (this.itemSize.y + this.itemOffset.y) * -1;
            // cc.log(`set : ${index}`);
        }
    }
}
