using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using URF.Core.EF.Trackable.Enums;
using URF.Core.EF.Trackable.Models;
using URF.Core.Helper.Extensions;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;

namespace Lazy.Travel.Api.Helpers
{
    public class UtilityHelper
    {
        public static List<string> FindControllers()
        {
            return FindAssemblies().SelectMany(c => c.DefinedTypes)
                .Where(c => c.Name.EndsWithEx("Controller"))
                .Where(c => !c.Name.EqualsEx("UtilityController"))
                .Where(c => !c.Name.EqualsEx("AdminBaseController"))
                .Select(c => c.Name.Replace("Controller", string.Empty))
                .Distinct()
                .ToList();
        }
        public static List<Assembly> FindAssemblies()
        {
            return AppDomain.CurrentDomain.GetAssemblies()
                .Where(c => c.FullName.ContainsEx("Lazy.Travel.Api")).ToList();
        }
        public static Type FindEntity(string entityName)
        {
            var type = AppDomain.CurrentDomain.GetAssemblies().SelectMany(c => c.DefinedTypes)
                .Where(c => c.FullName.ContainsEx("Lazy.Travel.Api.Data.Entities"))
                .Where(c => c.Name.EqualsEx(entityName))
                .FirstOrDefault();
            return type != null ? type.DeclaringType : null;
        }
        public static string CorrectAction(string action)
        {
            return action switch
            {
                "View" => "Xem",
                "Insert" => "Thêm mới",
                "Update" => "Sửa",
                "Delete" => "Xóa",
                "Active" => "Kích hoạt",
                _ => action,
            };
        }
        public static void CorrectExportData(TableData obj)
        {
            if (obj.Paging == null) obj.Paging = new PagingData
            {
                Index = 1,
                Size = obj.Export != null ? obj.Export.Limit : 1000
            };
            else
            {
                obj.Paging.Index = 1;
                obj.Paging.Size = obj.Export != null ? obj.Export.Limit : 1000;
            }
            var filters = obj.Filters ?? new List<FilterData>();
            var createdDateFilter = filters.Where(c => c.Name == "CreatedDate").FirstOrDefault();
            if (createdDateFilter == null)
            {
                createdDateFilter = new FilterData
                {
                    Name = "CreatedDate",
                    Compare = CompareType.D_Between,
                    Value = obj.Export.DateRange[0].ToString("dd/MM/yyyy"),
                    Value2 = obj.Export.DateRange[1].ToString("dd/MM/yyyy"),
                };
                obj.Filters.Add(createdDateFilter);
            }
        }
        public static List<string> FindActions(string controller)
        {
            if (controller.IsStringNullOrEmpty()) controller = string.Empty;
            switch (controller.ToLower())
            {
                case "msboxtextlink":
                    return new List<string> { "Cấu hình" };
                case "msmetaseo":
                    return new List<string> { "Xem", "Sửa", "Xem lịch sử" };
                case "msseotextlinkauto":
                    return new List<string> { "Xem", "Sửa", "Duyệt", "Sửa số text link" };
                case "msseotextlinkmanual":
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Xóa", "Duyệt", "Xuất dữ liệu", "Nhập dữ liệu", "Sửa số text link" };
                case "mafaffiliatesynthetic":
                    return new List<string> { "Xem", "Xem chi tiết", "Xuất dữ liệu", "Thanh toán", "Duyệt hóa đơn", "Duyệt hoa hồng" };
                case "mafcontract":
                    return new List<string> { "Xem", "Xem chi tiết", "Sửa", "Kiểm duyệt" };
                case "mbbanner":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Xóa", "Duyệt", "Từ chối", "Chạy", "Tạm dừng", "Dừng" };
                case "msseo":
                    return new List<string> { "Xem", "Xem lịch sử", "Thêm mới", "Sửa", "Xóa", "Xuất dữ liệu", "Nhập dữ liệu" };
                case "msseofile":
                case "mpoprojectvideos":
                    return new List<string> { "Xem", "Xóa" };
                case "msseotagfile":
                    return new List<string> { "Xem", "Xóa", "Duyệt" };
                case "mpoproject":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Duyệt", "Hủy", "Tải lên Video" };
                case "mpocustomer":
                    return new List<string> { "Xem", "Xem chi tiết" };
                case "mpocontributes":
                case "mpoprojecttype":
                case "mpoprojecthashtags":
                case "mpoprojectdocument":
                case "mpoprojectviolationtype":
                case "mpoprojectcategory":
                    return new List<string> { "Xem", "Thêm mới", "Sửa" };
                case "mpoprojectinvestor":
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Tải lên" };
                case "mporeviewcontribute":
                    return new List<string> { "Xem", "Xem chi tiết" };
                case "mpinvoice":
                    return new List<string> { "Xem", "Thêm mới", "Xem chi tiết", "Sửa", "Xuất dữ liệu", "Tách hóa đơn", "Gộp hóa đơn", "Xem chi tiết hóa đơn đã xuất", "Xóa" };
                case "mgrecruitment":
                    return new List<string> { "Xem", "Thêm mới", "Xuất dữ liệu", "Đăng lại tin", "Đăng tuyển", "Sửa", "Tạm dừng đăng", "Xóa" };
                case "mgprofile":
                    return new List<string> { "Xem", "Thêm mới", "Tạo/sửa ghi chú", "Cập nhật trạng thái" };
                case "mafaffiliaterequest":
                    return new List<string> { "Xem", "Xem chi tiết", "Sửa", "Kiểm duyệt" };
                case "mafaffiliate":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm nhánh", "Thêm TTKD", "Thay đổi đại diện", "Chuyển cây", "Xuất dữ liệu", "Thanh toán" };
                case "mmrequest":
                    return new List<string> { "Xem", "Nhận khách hàng", "Ghi chú", "Xuất dữ liệu" };
                case "mafpolicy":
                    return new List<string> { "Xem", "Xem chi tiết", "Sửa" };
                case "moservicehistory":
                    return new List<string> { "Xem", "Xem chi tiết" };
                case "mcrmcalllog":
                    return new List<string> { "Xem", "Xem chi tiết" };
                case "moorders":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Duyệt đơn hàng", "Xuất dữ liệu" };
                case "mmlookuphistory":
                    return new List<string> { "Xem", "Gán CSKH", "CSKH", "Ghi chú", "Xuất dữ liệu" };
                case "mlemployee":
                    return new List<string> { "Xem", "Thêm mới", "Xóa", "Xem lịch sử" };
                case "mlcouponhmc":
                    return new List<string> { "Xem", "Mở lại Coupon", "Xử lý giao dịch" };
                case "mlcompany":
                    return new List<string> { "Xem", "Kiểm duyệt", "Xem yêu cầu đăng ký", "Nhận khách hàng", "Kiểm toán" };
                case "mlschedule":
                    return new List<string> { "Xem", "Sửa", "Hủy", "CSKH", "Xem lịch sử" };
                case "team":
                case "product":
                case "position":
                case "department":
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Xóa", "Thêm nhân viên" };
                case "role":
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Xóa", "Thêm nhân viên", "Phân quyền" };
                case "moservices":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm dịch vụ", "Thêm combo", "Thay đổi giá" };
                case "mptransactions":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Duyệt nạp tiền", "Duyệt rút tiền", "Kế toán duyệt", "Ghi chú", "Xuất dữ liệu" };
                case "user":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Xóa", "Thiết lập mật khẩu", "Khóa tài khoản", "Mở khóa tài khoản", "Tạo OTP", "Xem OTP" };
                case "mluser":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Xóa", "Thiết lập mật khẩu", "Khóa tài khoản", "Mở khóa tài khoản", "Xác thực", "Cập nhật V2", "Xuất dữ liệu", "Nhập vào CRM", "Tạo giao dịch" };
                case "mlarticle":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Xóa", "Duyệt tin", "Duyệt nội dung", "Xác minh tin", "Đăng lại tin", "Hạ tin", "Điều chuyển tin", "Đồng bộ tin", "Nhận tin", "Đẩy tin" };
                case "mlarticlereport":
                    return new List<string> { "Xem", "Xem chi tiết", "Kiểm duyệt" };
                case "mlarticlecrawl":
                    return new List<string> { "Xem", "Xem chi tiết", "Sửa", "Xóa", "Đồng bộ tin", "Duyệt nội dung", "Xác minh tin", "Đăng lại tin", "Hạ tin", "Điều chuyển tin", "Nhận tin", "Đẩy tin" };
                case "mcrmcustomer":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Xuất dữ liệu", "Nhận khách hàng", "Gán Sale", "Gán CSKH", "Gọi điện", "Gửi Email", "Ghi chú", "Chuyển trạng thái", "Chuyển trạng thái thành công", "Xem cuộc gọi", "Gộp khách hàng" };
                case "mcrmcustomerlead":
                    return new List<string> { "Xem", "Xem chi tiết", "Thêm mới", "Sửa", "Nhập dữ liệu", "Gọi điện", "Gửi Email", "Ghi chú", "Chuyển trạng thái", "Tạo tài khoản" };
                case "mcrmcustomerrequest":
                    return new List<string> { "Xem", "Xem chi tiết", "Duyệt yêu cầu" };
                case "mcrmiframecontract":
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Xem chi tiết", "Xem lịch sử", "Xóa" };
                case "mccoupon":
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Xem chi tiết", "Xem lịch sử", "Khóa", "Mở khóa", "Chạy", "Tạm dừng" };
                default:
                    return new List<string> { "Xem", "Thêm mới", "Sửa", "Xóa", "Xem chi tiết" };
            }
        }
        public static FileContentResult Export(TableData obj, DataTable table)
        {
            var ignoreProperties = new string[] { "Id", "IsActive", "IsDelete", "CreatedBy", "UpdatedBy", "CreatedDate", "UpdatedDate" };
            if (table != null && table.Columns.Count > 0)
            {
                foreach (var property in ignoreProperties)
                {
                    var column = table.Columns.Cast<DataColumn>().FirstOrDefault(c => c.ColumnName == property);
                    if (column != null)
                        table.Columns.Remove(column);
                }
            }
            return obj.Export.Type switch
            {
                ExportType.Csv => ExportToCsv(obj, table),
                ExportType.Pdf => ExportToPdf(obj, table),
                ExportType.Excel => ExportToExcel(obj, table),
                _ => ExportToExcel(obj, table),
            };
        }
        private static FileContentResult ExportToCsv(TableData obj, DataTable table)
        {
            var index = 0;
            var workbook = new XLWorkbook();
            IXLWorksheet worksheet = workbook.Worksheets.Add(obj.Name);
            foreach (var column in table.Columns.Cast<DataColumn>())
            {
                index += 1;
                worksheet.Cell(1, index).Style.Font.Bold = true;
                worksheet.Cell(1, index).Value = column.ColumnName;
                worksheet.Cell(1, index).Style.Font.FontColor = XLColor.White;
                worksheet.Cell(1, index).Style.Fill.BackgroundColor = XLColor.Blue;
                worksheet.Cell(1, index).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                worksheet.Cell(1, index).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            }

            index = 0;
            foreach (var row in table.Rows.Cast<DataRow>())
            {
                index += 1;
                for (var i = 0; i < table.Columns.Count; i++)
                {
                    worksheet.Cell(index + 1, i + 1).Value = row[i] != null ? row[i].ToString() : string.Empty;
                }
            }
            worksheet.Rows().AdjustToContents();
            worksheet.Columns().AdjustToContents();

            var lastCellAddress = worksheet.RangeUsed().LastCell().Address;
            var contentText = string.Join(Environment.NewLine, worksheet.Rows(1, lastCellAddress.RowNumber)
                .Select(r => string.Join(",", r.Cells(1, lastCellAddress.ColumnNumber)
                        .Select(cell =>
                        {
                            var cellValue = cell.GetValue<string>();
                            return cellValue.Contains(",") ? $"\"{cellValue}\"" : cellValue;
                        }))));
            var contentType = "application/csv";

            using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(contentText)))
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                return new FileContentResult(content, contentType);
            }
        }
        private static FileContentResult ExportToPdf(TableData obj, DataTable table)
        {
            PageSize pageSize = obj.Export.PageSize switch
            {
                PdfPageSizeType.A0 => iText.Kernel.Geom.PageSize.A0,
                PdfPageSizeType.A1 => iText.Kernel.Geom.PageSize.A1,
                PdfPageSizeType.A2 => iText.Kernel.Geom.PageSize.A2,
                PdfPageSizeType.A3 => iText.Kernel.Geom.PageSize.A3,
                PdfPageSizeType.A4 => iText.Kernel.Geom.PageSize.A4,
                PdfPageSizeType.A5 => iText.Kernel.Geom.PageSize.A5,
                PdfPageSizeType.A6 => iText.Kernel.Geom.PageSize.A6,
                _ => iText.Kernel.Geom.PageSize.A4,
            };
            if (obj.Export.Landscape) pageSize = pageSize.Rotate();

            MemoryStream PDFData = new MemoryStream();
            var writer = new PdfWriter(PDFData);
            var pdfDocument = new PdfDocument(writer);
            var document = new Document(pdfDocument, pageSize);

            var font5 = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

            float[] widths = new float[table.Columns.Count];
            for (int i = 0; i < widths.Length; i++)
            {
                widths[i] = 4f;
            }
            Table pdfTable = new Table(widths);
            pdfTable.SetWidth(UnitValue.CreatePercentValue(100));

            foreach (DataColumn c in table.Columns)
            {
                pdfTable.AddCell(new Cell().Add(new Paragraph(c.ColumnName).SetFont(font5).SetFontSize(5)));
            }

            foreach (DataRow r in table.Rows)
            {
                if (table.Columns.Count > 0)
                {
                    for (int i = 0; i < table.Columns.Count; i++)
                    {
                        pdfTable.AddCell(new Cell().Add(new Paragraph(r[i].ToString()).SetFont(font5).SetFontSize(5)));
                    }
                }
            }
            document.Add(pdfTable);
            document.Close();
            string contentType = "application/pdf";
            var content = PDFData.ToArray();
            return new FileContentResult(content, contentType);
        }
        private static FileContentResult ExportToExcel(TableData obj, DataTable table)
        {
            var index = 0;
            var workbook = new XLWorkbook();
            IXLWorksheet worksheet = workbook.Worksheets.Add(obj.Name);
            foreach (var column in table.Columns.Cast<DataColumn>())
            {
                index += 1;
                worksheet.Cell(1, index).Style.Font.Bold = true;
                worksheet.Cell(1, index).Value = column.ColumnName;
                worksheet.Cell(1, index).Style.Font.FontColor = XLColor.White;
                worksheet.Cell(1, index).Style.Fill.BackgroundColor = XLColor.Blue;
                worksheet.Cell(1, index).Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                worksheet.Cell(1, index).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            }

            index = 0;
            foreach (var row in table.Rows.Cast<DataRow>())
            {
                index += 1;
                for (var i = 0; i < table.Columns.Count; i++)
                {
                    worksheet.Cell(index + 1, i + 1).Value = row[i] != null ? row[i].ToString() : string.Empty;
                }
            }
            worksheet.Rows().AdjustToContents();
            worksheet.Columns().AdjustToContents();

            string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                return new FileContentResult(content, contentType);
            }
        }
    }
}
