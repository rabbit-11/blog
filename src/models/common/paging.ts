
interface BasePaging {
    pageIndex?: number;
    pageSize?: number;
    totalCount?: number;
    enableTotalCount?: boolean;

}
export default class Paging implements BasePaging {
    [index: string]: number;
}