using ClosedXML.Excel;
using FastMember;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using URF.Core.Helper.Extensions;

namespace URF.Core.Helper.Helpers
{
    public class ExcelHelper
    {
        public static List<List<object>> ToList(string url, int sheet = 0, int headerRow = 0)
        {
            var items = new List<List<object>>();
            using (MemoryStream ms = new())
            {
                using (HttpClient client = new())
                {
                    client.GetStreamAsync(url).Result.CopyTo(ms);
                    items = ToList(ms, sheet, headerRow);
                }
            }
            return items;
        }
        public static List<List<object>> ToList(Stream stream, int sheet = 0, int headerRow = 0)
        {
            var items = new List<List<object>>();
            var workbook = new XLWorkbook(stream);
            if (workbook.Worksheets.Count > sheet)
            {
                var ws = workbook.Worksheets.ToList()[sheet];
                var rows = ws.Rows().Where(c => !c.IsEmpty()).ToList();
                if (!rows.IsNullOrEmpty())
                {
                    var headers = new List<string>();
                    items = rows.Select((value, index) => (value, index))
                                       .Select(r => r.value.Cells(false).ToList().Select(c => c.CachedValue).ToList())
                                       .Skip(headerRow)
                                       .ToList();
                }
            }
            return items;
        }

        public static List<Dictionary<string, object>> ToDictionary(string url, int sheet = 0, int headerRow = 0)
        {
            var items = new List<Dictionary<string, object>>();
            using (MemoryStream ms = new())
            {
                using (HttpClient client = new())
                {
                    client.GetStreamAsync(url).Result.CopyTo(ms);
                    items = ToDictionary(ms, sheet, headerRow);
                }
            }
            return items;
        }
        public static List<Dictionary<string, object>> ToDictionary(Stream stream, int sheet = 0, int headerRow = 0)
        {
            var items = new List<Dictionary<string, object>>();
            var workbook = new XLWorkbook(stream);
            if (workbook.Worksheets.Count > sheet)
            {
                var ws = workbook.Worksheets.ToList()[sheet];
                var rows = ws.Rows().Where(c => !c.IsEmpty()).ToList();
                if (!rows.IsNullOrEmpty())
                {
                    var headers = new List<string>();
                    foreach (var item in rows.Select((value, index) => (value, index)))
                    {
                        var row = item.value;
                        if (item.index == headerRow)
                        {
                            var cells = new List<string>();
                            try
                            {
                                cells = row.Cells().ToList()
                                    .Select(c => c.CachedValue.ToString())
                                    .ToList();
                            }
                            catch
                            {
                                try
                                {
                                    cells = row.Cells().ToList()
                                        .Select(c => c.Value.ToString())
                                        .ToList();
                                }
                                catch
                                {
                                    cells = row.Cells().ToList()
                                        .Select(c => c.GetString())
                                        .ToList();
                                }
                            }
                            foreach (var cell in cells)
                                headers.Add(cell.TrimEx());
                        }
                        else if (item.index > headerRow)
                        {
                            var cells = new List<string>();
                            try
                            {
                                cells = row.Cells().ToList()
                                    .Select(c => c.CachedValue.ToString())
                                    .ToList();
                            }
                            catch
                            {
                                try
                                {
                                    cells = row.Cells().ToList()
                                        .Select(c => c.Value.ToString())
                                        .ToList();
                                }
                                catch
                                {
                                    cells = row.Cells().ToList()
                                        .Select(c => c.GetString())
                                        .ToList();
                                }
                            }
                            var dic = new Dictionary<string, object>();
                            for (int i = 0; i < cells.Count; i++)
                            {
                                var cell = cells[i];
                                var key = headers[i];
                                if (!dic.ContainsKey(key))
                                    dic.Add(key, cell);
                                else
                                {
                                    key = key + "_" + i;
                                    dic.Add(key, cell);
                                }
                            }
                            items.Add(dic);
                        }
                    }
                }
            }
            return items;
        }

        public static List<T> ToObject<T>(string url, int sheet = 0)
        {
            var items = new List<T>();
            using (MemoryStream ms = new())
            {
                using (HttpClient client = new())
                {
                    client.GetStreamAsync(url).Result.CopyTo(ms);
                    items = ToObject<T>(ms, sheet);
                }
            }
            return items;
        }
        public static List<T> ToObject<T>(Stream stream, int sheet = 0)
        {
            var items = new List<T>();
            var workbook = new XLWorkbook(stream);
            if (workbook.Worksheets.Count > sheet)
            {
                var ws = workbook.Worksheets.ToList()[sheet];
                var rows = ws.Rows().Where(c => !c.IsEmpty()).ToList();
                if (!rows.IsNullOrEmpty())
                {
                    var dataTable = ToTable(rows);
                    foreach (DataRow row in dataTable.Rows)
                    {
                        T item = GetItem<T>(row);
                        items.Add(item);
                    }
                }
            }
            return items;
        }
        private static DataTable ToTable(List<IXLRow> rows)
        {
            DataTable dt = new DataTable();
            bool firstRow = true;
            foreach (IXLRow row in rows)
            {
                if (firstRow)
                {
                    foreach (IXLCell cell in row.Cells())
                    {
                        dt.Columns.Add(cell.CachedValue.ToString());
                    }
                    firstRow = false;
                }
                else
                {
                    //Add rows to DataTable.
                    dt.Rows.Add();
                    int i = 0;

                    foreach (IXLCell cell in row.Cells(row.FirstCellUsed().Address.ColumnNumber, row.LastCellUsed().Address.ColumnNumber))
                    {
                        dt.Rows[dt.Rows.Count - 1][i] = cell.CachedValue.ToString();
                        i++;
                    }
                }
            }
            return dt;
        }
        private static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();
            try
            {
                foreach (DataColumn column in dr.Table.Columns)
                {
                    foreach (PropertyInfo pro in temp.GetProperties())
                    {
                        if (pro.Name == column.ColumnName)
                        {
                            if (dr[column.ColumnName] != null && dr[column.ColumnName] != DBNull.Value)
                                pro.SetValue(obj, dr[column.ColumnName], null);
                        }
                        else
                            continue;
                    }
                }
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }

            return obj;
        }

        public static Stream ToExcel(Stream stream, DataTable table, int sheet = 0, int startRow = 0, bool adjustRow = false)
        {
            var workbook = new XLWorkbook(stream);
            if (workbook.Worksheets.Count > sheet)
            {
                var index = startRow;
                var ws = workbook.Worksheets.ToList()[sheet];
                foreach (var row in table.Rows.Cast<DataRow>())
                {
                    for (var i = 0; i < table.Columns.Count; i++)
                    {
                        var value = row[i] != null ? row[i].ToString() : string.Empty;
                        ws.Cell(index + 1, i + 1).SetValue(value);
                        if (row[i].GetType() == typeof(decimal) || row[i].GetType() == typeof(double))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Number;
                        }
                        else if (row[i].GetType() == typeof(long) || row[i].GetType() == typeof(int))
                        {
                            ws.Cell(index + 1, i + 1).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Number;
                        }
                        else if (row[i].GetType() == typeof(bool))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Boolean;
                        }
                        else if (row[i].GetType() == typeof(DateTime))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.DateTime;
                        }
                        else
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Text;
                        }
                    }
                    index += 1;
                }
                if (adjustRow)
                    ws.Rows().AdjustToContents();
                var memoryStream = new MemoryStream();
                workbook.SaveAs(memoryStream);
                return memoryStream;
            }
            return null;
        }
        public static Stream ToExcel(Stream stream, List<Dictionary<string, object>> items, int sheet = 0, int startRow = 0, bool adjustRow = false)
        {
            var table = new DataTable();
            using var reader = ObjectReader.Create(items);
            table.Load(reader);
            return ToExcel(stream, table, sheet, startRow, adjustRow);
        }

        /// <summary>
        /// Export excel
        /// </summary>
        /// <param name="cellValues">Ex: F4:Value,F5:Value2</param>
        /// <returns></returns>
        public static Stream ToExcel(Stream stream, DataTable table, Dictionary<string, object> cellValues, int sheet = 0, int startRow = 0, bool adjustRow = false)
        {
            var workbook = new XLWorkbook(stream);
            if (workbook.Worksheets.Count > sheet)
            {
                var index = startRow;
                var ws = workbook.Worksheets.ToList()[sheet];
                if (!cellValues.IsNullOrEmpty())
                {
                    foreach (var item in cellValues)
                    {
                        var value = item.Value != null ? item.Value.ToString() : string.Empty;
                        ws.Cell(item.Key).SetValue(value);
                        if (item.Value.GetType() == typeof(decimal) || item.Value.GetType() == typeof(double))
                        {
                            ws.Cell(item.Key).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(item.Key).DataType = XLDataType.Number;
                        }
                        else if (item.Value.GetType() == typeof(long) || item.Value.GetType() == typeof(int))
                        {
                            ws.Cell(item.Key).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(item.Key).DataType = XLDataType.Number;
                        }
                        else if (item.Value.GetType() == typeof(bool))
                        {
                            ws.Cell(item.Key).DataType = XLDataType.Boolean;
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else if (item.Value.GetType() == typeof(DateTime))
                        {
                            ws.Cell(item.Key).DataType = XLDataType.DateTime;
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else
                            ws.Cell(item.Key).DataType = XLDataType.Text;
                    }
                }
                foreach (var row in table.Rows.Cast<DataRow>())
                {
                    for (var i = 0; i < table.Columns.Count; i++)
                    {
                        var value = row[i] != null ? row[i].ToString() : string.Empty;
                        ws.Cell(index + 1, i + 1).SetValue(value);
                        if (row[i].GetType() == typeof(decimal) || row[i].GetType() == typeof(double))
                        {
                            ws.Cell(index + 1, i + 1).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Number;
                        }
                        else if (row[i].GetType() == typeof(long) || row[i].GetType() == typeof(int))
                        {
                            ws.Cell(index + 1, i + 1).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Number;
                        }
                        else if (row[i].GetType() == typeof(bool))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Boolean;
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else if (row[i].GetType() == typeof(DateTime))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.DateTime;
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Text;
                        }
                    }
                    index += 1;
                }
                if (adjustRow)
                    ws.Rows().AdjustToContents();
                var memoryStream = new MemoryStream();
                workbook.SaveAs(memoryStream);
                return memoryStream;
            }
            return null;
        }
        public static Stream ToExcel(Stream stream, List<Dictionary<string, object>> items, Dictionary<string, object> cellValues, int sheet = 0, int startRow = 0, bool adjustRow = false)
        {
            var workbook = new XLWorkbook(stream);
            if (workbook.Worksheets.Count > sheet)
            {
                var index = startRow;
                var ws = workbook.Worksheets.ToList()[sheet];
                if (!cellValues.IsNullOrEmpty())
                {
                    foreach (var item in cellValues)
                    {
                        var value = item.Value != null ? item.Value.ToString() : string.Empty;
                        ws.Cell(item.Key).SetValue(value);
                        if (item.Value.GetType() == typeof(decimal) || item.Value.GetType() == typeof(double))
                        {
                            ws.Cell(item.Key).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(item.Key).DataType = XLDataType.Number;
                        }
                        else if (item.Value.GetType() == typeof(long) || item.Value.GetType() == typeof(int))
                        {
                            ws.Cell(item.Key).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(item.Key).DataType = XLDataType.Number;
                        }
                        else if (item.Value.GetType() == typeof(bool))
                        {
                            ws.Cell(item.Key).DataType = XLDataType.Boolean;
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else if (item.Value.GetType() == typeof(DateTime))
                        {
                            ws.Cell(item.Key).DataType = XLDataType.DateTime;
                            ws.Cell(item.Key).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else
                            ws.Cell(item.Key).DataType = XLDataType.Text;
                    }
                }
                foreach (var row in items)
                {
                    for (var i = 0; i < row.Values.Count; i++)
                    {

                        var value = row.ElementAt(i).Value != null
                            ? row.ElementAt(i).Value.ToString()
                            : string.Empty;
                        ws.Cell(index + 1, i + 1).SetValue(value);
                        var type = row.ElementAt(i).Value != null
                            ? row.ElementAt(i).Value.GetType()
                            : typeof(string);
                        if (type == typeof(decimal) || type == typeof(double))
                        {
                            if (value != "0")
                                ws.Cell(index + 1, i + 1).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Number;
                        }
                        else if (type == typeof(long) || type == typeof(int))
                        {
                            if (value != "0")
                                ws.Cell(index + 1, i + 1).Style.NumberFormat.Format = "_-* #,##0_-;-* #,##0_-;_-* \"-\"??_-;_-@_-";
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Number;
                        }
                        else if (type == typeof(bool))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Boolean;
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else if (type == typeof(DateTime))
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.DateTime;
                            ws.Cell(index + 1, i + 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                        }
                        else
                        {
                            ws.Cell(index + 1, i + 1).DataType = XLDataType.Text;
                        }
                    }
                    index += 1;
                }
                if (adjustRow)
                    ws.Rows().AdjustToContents();
                var memoryStream = new MemoryStream();
                workbook.SaveAs(memoryStream);
                return memoryStream;
            }
            return null;
        }
    }
}
