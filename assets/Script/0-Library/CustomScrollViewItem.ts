import CustomScrollViewManager from "./CustomScrollViewManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CustomScrollViewItem extends cc.Component {

    /** インデックス */
    public index:number = -1;

    /** マネージャー */
    protected manager: CustomScrollViewManager;

    public onDestroy() {
        this.manager = null;
    }

    /**
     * 初期化
     * @param manager 
     */
    public init(manager: CustomScrollViewManager) {
        this.manager = manager;
    } 

    /**
     * アイテムの表示を更新する
     * indexに負の値を入れると表示を消す。
     * @param index 
     */
    updateItem (index: number) {
        this.index = index;
    }
}
