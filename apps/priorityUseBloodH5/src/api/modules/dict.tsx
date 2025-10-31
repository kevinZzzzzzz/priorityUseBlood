import http from "../index";

  /**
   * 获取优先用血枚举字典查询列表
   * @returns
   */
  export const getPriorityUseBloodTypeDict = async (preKey: string) => {
    return await http._get(`supv/superv/api/enums/${preKey}`, null);
  };
