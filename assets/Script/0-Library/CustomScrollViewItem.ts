import CustomScrollViewManager from "./CustomScrollViewManager";

// tslint:disable-next-line: no-unused-declaration typedef
const { ccclass, property } = cc._decorator;

/**
 * CustomScrollViewManagerのアイテム
 * 継承して使用することを想定。
 */
@ccclass
export default class CustomScrollViewItem extends cc.Component {
    /** インデックス */
    public index: number = -1;

    /** マネージャー */
    protected manager: CustomScrollViewManager;

    public onDestroy(): void {
        this.manager = null;
    }

    /**
     * 初期化
     * @param manager
     */
    public init(manager: CustomScrollViewManager): void {
        this.manager = manager;
    }

    /**
     * アイテムのindexを更新する
     * 継承先ではこの関数をoverrideして表示を制御するのがよいと思われる。
     * @param index
     */
    public updateItem(index: number): void {
        this.index = index;
    }
}
