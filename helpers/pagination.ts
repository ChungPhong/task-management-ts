interface ObjectPagination {
  currentPage: number;
  limitPage: number;
  skip?: number;
  totalPage?: number;
}
const paginationHelpers = (
  objectPagination: ObjectPagination,
  query: Record<string, any>,
  countRecords: number
): ObjectPagination => {
  // Xử lý trang hiện tại
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  if (query.limit) {
    objectPagination.limitPage = parseInt(query.limit);
  }

  // Tính toán số trang tối đa
  const totalPage = Math.ceil(countRecords / objectPagination.limitPage);
  objectPagination.totalPage = totalPage;

  // Đảm bảo rằng trang hiện tại không vượt quá tổng số trang
  if (objectPagination.currentPage > totalPage) {
    objectPagination.currentPage = totalPage; // Đặt lại trang hiện tại thành trang cuối cùng
  }

  // Tính toán số lượng bản ghi bỏ qua (skip)
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitPage;

  return objectPagination;
};

export default paginationHelpers;
