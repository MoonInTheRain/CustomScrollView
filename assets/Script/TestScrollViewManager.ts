import CustomScrollViewManager from "./Library/CustomScrollViewManager";
import TestItem from "./TestItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestScrollViewManager extends CustomScrollViewManager {



    private clickedItemList: string[] = [];

    public onClickItem(item: TestItem) {
        const index = this.clickedItemList.indexOf(item.id);
        if (index >= 0) {
            this.clickedItemList.splice(index, 1);
        } else {
            this.clickedItemList.push(item.id);
        }
    }

    public isSelectedItem(item: TestItem): boolean {
        return this.clickedItemList.indexOf(item.id) >= 0;
    }

    // update (dt) {}
}
