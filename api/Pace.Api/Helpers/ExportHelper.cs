using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;

namespace Pace.Api.Helpers
{
    public static class ExportHelper
    {
        public static FileContentResult ExportToCsv(string name, DataTable table)
        {
            var sb = new StringBuilder();
            sb.AppendLine(string.Join(",", table.Columns.Cast<DataColumn>().Select(c => $"\"{c.ColumnName}\"")));
            foreach (DataRow row in table.Rows)
                sb.AppendLine(string.Join(",", table.Columns.Cast<DataColumn>().Select(c => $"\"{row[c]}\"")));

            var data = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
            return new FileContentResult(data, "application/csv") { FileDownloadName = $"{name}.csv" };
        }

        public static FileContentResult ExportToExcel(string name, DataTable table)
        {
            var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add(name);
            var col = 1;
            foreach (DataColumn c in table.Columns)
            {
                ws.Cell(1, col).Value = c.ColumnName;
                ws.Cell(1, col).Style.Font.Bold = true;
                ws.Cell(1, col).Style.Fill.BackgroundColor = XLColor.FromHtml("#2B5BFF");
                ws.Cell(1, col).Style.Font.FontColor = XLColor.White;
                col++;
            }
            var row = 2;
            foreach (DataRow r in table.Rows)
            {
                for (var i = 0; i < table.Columns.Count; i++)
                    ws.Cell(row, i + 1).SetValue(r[i]?.ToString() ?? "");
                row++;
            }
            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return new FileContentResult(stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            { FileDownloadName = $"{name}.xlsx" };
        }
    }
}
