/**
 * 仿照模版树
 */
window.ProTree = {};
$(function() {

    // 处理树展示
    $("[proTree]").each(function(index, item) {
        var id = $(item).attr("id");
        var treeKey = $(item).attr("treeKey");
        var nodeKey = $(item).attr("nodeKey");
        if (!id) {
            id = "tree_" + GetRandomStr(6);
            $(item).attr("id", id);
        }
        var callbackStr = $(item).attr("callBack");
        var callbackFun;
        if (callbackStr) {
            callbackFun = eval(callbackStr);
        }
        $(item).attr("class", "ztree");
        SysTree.loadTree(id, treeKey, nodeKey, callbackFun);
    });

    $("[proTreeGroup]").each(function(index, item) {
        $(item).attr("class", "ztree");
        var id = $(item).attr("id");
        var treeKey = $(item).attr("treeKey");
        var nodeKey = $(item).attr("nodeKey");
        if (!id) {
            id = "tree_" + GetRandomStr(6);
            $(item).attr("id", id);
        }
        var groupColumn = $(item).attr("groupColumn");
        if (!groupColumn) {
            groupColumn = "group_id_";
        }

        var callbackFun = function(event, treeId, treeNode) {
            $("[ab-grid]").bootstrapTable("refreshOptions", {
                queryParams : function(params) {
                    params[groupColumn + "^VEQ"] = treeNode.id;
                    return params;
                }
            });
        }

        ProTree.loadTree(id, treeKey, nodeKey, callbackFun);
    });

})

window.ProTree.loadTree = function(id, treeKey, nodeKey, callBack) {
    // 请求参数
    var params = {
        // 树id
        treeKey : treeKey
    };
    if (nodeKey) {
        params.nodeKey = nodeKey;
    }
    var url = __ctx + "/web/process/menu";
    var ztreeCreator = new ZtreeCreator(id, url);
    if (callBack) {
        ztreeCreator.setCallback({
            onClick : callBack
        });
    }

    ztreeCreator.initZtree(params);
};
