using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using URF.Core.EF.Trackable.Enums;
using URF.Core.Helper.Extensions;

namespace URF.Core.Services
{
    public class HttpClientEx : IHttpClientEx
    {
        public async Task<string> Delete(string url, string id, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                    {
                        token = token
                            .Replace("Bearer", string.Empty)
                            .Replace("bearer", string.Empty)
                            .Trim();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    else if (token.Contains(":"))
                    {
                        var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                    }
                    else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                }

                url = url.Contains(id)
                    ? url
                    : url + "/" + id;
                var response = await client.DeleteAsync(url).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
                else
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
            }
        }
        public async Task<string> Delete(string url, object obj, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                    {
                        token = token
                            .Replace("Bearer", string.Empty)
                            .Replace("bearer", string.Empty)
                            .Trim();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    else if (token.Contains(":"))
                    {
                        var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                    }
                    else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                }
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Delete,
                    RequestUri = new Uri(url),
                    Content = new StringContent(ToJson(obj), Encoding.UTF8, "application/json")
                };
                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
                else
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
            }
        }

        public async Task<string> Get(string url, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.ToLower().Contains("[basic]"))
                    {
                        var items = token.Split("]_[", StringSplitOptions.RemoveEmptyEntries)
                            .Select(c => c.Trim(new[] { '[', ']', '_', ' ' }))
                            .Where(c => c.Trim() != string.Empty)
                            .Where(c => c.ToLower() != "basic")
                            .ToList();
                        if (items.Count >= 2)
                        {
                            var user = items[0].Split(":").LastOrDefault();
                            var password = items[1].Split(":").LastOrDefault();

                            var authenticationString = $"{user}:{password}";
                            var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(authenticationString));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);
                        }
                    }
                    else
                    {
                        if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                        {
                            token = token
                                .Replace("Bearer", string.Empty)
                                .Replace("bearer", string.Empty)
                                .Trim();
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        }
                        else if (token.Contains(":"))
                        {
                            var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                        }
                        else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                    }
                }
                try
                {
                    var response = await client.GetAsync(url).ConfigureAwait(false);
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonContent = await response.Content.ReadAsStringAsync();
                        return jsonContent;
                    }
                    else
                    {
                        var jsonContent = await response.Content.ReadAsStringAsync();
                        return jsonContent;
                    }
                }
                catch
                {
                    return string.Empty;
                }
            }
        }
        public async Task<Stream> GetFile(string url, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.ToLower().Contains("[basic]"))
                    {
                        var items = token.Split("]_[", StringSplitOptions.RemoveEmptyEntries)
                            .Select(c => c.Trim(new[] { '[', ']', '_', ' ' }))
                            .Where(c => c.Trim() != string.Empty)
                            .Where(c => c.ToLower() != "basic")
                            .ToList();
                        if (items.Count >= 2)
                        {
                            var user = items[0].Split(":").LastOrDefault();
                            var password = items[1].Split(":").LastOrDefault();

                            var authenticationString = $"{user}:{password}";
                            var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(authenticationString));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);
                        }
                    }
                    else
                    {
                        if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                        {
                            token = token
                                .Replace("Bearer", string.Empty)
                                .Replace("bearer", string.Empty)
                                .Trim();
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        }
                        else if (token.Contains(":"))
                        {
                            var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                        }
                        else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                    }
                }
                try
                {
                    var response = await client.GetAsync(url).ConfigureAwait(false);
                    if (response.IsSuccessStatusCode)
                    {
                        var stramContent = await response.Content.ReadAsStreamAsync();
                        return stramContent;
                    }
                    else
                    {
                        return null;
                    }
                }
                catch
                {
                    return null;
                }
            }
        }
        public async Task<string> Put(string url, object obj, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                    {
                        token = token
                            .Replace("Bearer", string.Empty)
                            .Replace("bearer", string.Empty)
                            .Trim();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    else if (token.Contains(":"))
                    {
                        var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                    }
                    else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                }
                var content = new StringContent(ToJson(obj), Encoding.UTF8, "application/json");
                var response = await client.PutAsync(url, content).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
                else
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
            }
        }
        public async Task<string> Post(string url, object obj, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                    {
                        token = token
                            .Replace("Bearer", string.Empty)
                            .Replace("bearer", string.Empty)
                            .Trim();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    else if (token.Contains(":"))
                    {
                        var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                    }
                    else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                }
                var content = new StringContent(ToJson(obj), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
                else
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
            }
        }
        public async Task<string> Patch(string url, object obj, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                    {
                        token = token
                            .Replace("Bearer", string.Empty)
                            .Replace("bearer", string.Empty)
                            .Trim();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    else if (token.Contains(":"))
                    {
                        var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                    }
                    else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                }
                var content = new StringContent(ToJson(obj), Encoding.UTF8, "application/json");
                var response = await client.PatchAsync(url, content).ConfigureAwait(false);
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
                else
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
            }
        }
        public async Task<string> PostXForm(string url, Dictionary<string, string> obj, string token = default)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
                if (token != null && token.Trim() != string.Empty)
                {
                    if (token.StartsWith("Bearer") || token.StartsWith("bearer"))
                    {
                        token = token
                            .Replace("Bearer", string.Empty)
                            .Replace("bearer", string.Empty)
                            .Trim();
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    else if (token.Contains(":"))
                    {
                        var base64EncodedAuthenticationString = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", base64EncodedAuthenticationString);

                    }
                    else client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                }
                using (var content = new FormUrlEncodedContent(obj))
                {
                    content.Headers.Clear();
                    content.Headers.Add("Content-Type", "application/x-www-form-urlencoded");

                    HttpResponseMessage response = await client.PostAsync(url, content);
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonContent = await response.Content.ReadAsStringAsync();
                        return jsonContent;
                    }
                }
            }
            return string.Empty;
        }

        public async Task<string> CallApi(string url, object obj = null, Dictionary<string, string> headers = null, MethodType type = MethodType.Get)
        {
            using (var client = new HttpClient())
            {
                var httpMethod = HttpMethod.Get;
                switch (type)
                {
                    case MethodType.Put:
                        httpMethod = HttpMethod.Put;
                        break;
                    case MethodType.Post:
                        httpMethod = HttpMethod.Post;
                        break;
                    case MethodType.Delete:
                        httpMethod = HttpMethod.Delete;
                        break;
                    case MethodType.Patch:
                        httpMethod = HttpMethod.Patch;
                        break;
                }
                if (obj != null && type == MethodType.Get)
                {
                    var keyValues = (Dictionary<string, object>)obj;
                    if (keyValues != null && keyValues.Count > 0)
                    {
                        foreach (var keyValue in keyValues)
                        {
                            if (keyValue.Value == null) continue;
                            url += url.Contains("?")
                                ? "&" + keyValue.Key + "=" + HttpUtility.UrlEncode(keyValue.Value.ToString())
                                : "?" + keyValue.Key + "=" + HttpUtility.UrlEncode(keyValue.Value.ToString());
                        }
                    }
                }

                var request = new HttpRequestMessage(httpMethod, url);
                if (!headers.IsNullOrEmpty())
                {
                    foreach (var item in headers)
                        request.Headers.Add(item.Key, item.Value);
                }
                if (obj != null && type != MethodType.Get)
                {
                    if (obj is IFormFile)
                    {
                        var file = (IFormFile)obj;
                        request.Content = new StreamContent(file.OpenReadStream());
                    }
                    else request.Content = new StringContent(ToJson(obj), Encoding.UTF8, "application/json");
                }
                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    return jsonContent;
                }
            }
            return string.Empty;
        }

        public async Task<byte[]> CallApiByte(string url, object obj = null, Dictionary<string, string> headers = null, MethodType type = MethodType.Get)
        {
            using (var client = new HttpClient())
            {
                var httpMethod = HttpMethod.Get;
                switch (type)
                {
                    case MethodType.Put:
                        httpMethod = HttpMethod.Put;
                        break;
                    case MethodType.Post:
                        httpMethod = HttpMethod.Post;
                        break;
                    case MethodType.Delete:
                        httpMethod = HttpMethod.Delete;
                        break;
                    case MethodType.Patch:
                        httpMethod = HttpMethod.Patch;
                        break;
                }
                if (obj != null && type == MethodType.Get)
                {
                    var keyValues = (Dictionary<string, object>)obj;
                    if (keyValues != null && keyValues.Count > 0)
                    {
                        foreach (var keyValue in keyValues)
                        {
                            if (keyValue.Value == null) continue;
                            url += url.Contains("?")
                                ? "&" + keyValue.Key + "=" + HttpUtility.UrlEncode(keyValue.Value.ToString())
                                : "?" + keyValue.Key + "=" + HttpUtility.UrlEncode(keyValue.Value.ToString());
                        }
                    }
                }

                var request = new HttpRequestMessage(httpMethod, url);
                foreach (var item in headers)
                    request.Headers.Add(item.Key, item.Value);
                if (obj != null && type != MethodType.Get)
                {
                    if (obj is IFormFile)
                    {
                        var file = (IFormFile)obj;
                        request.Content = new StreamContent(file.OpenReadStream());
                    }
                    else request.Content = new StringContent(ToJson(obj), Encoding.UTF8, "application/json");
                }
                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jbyte = await response.Content.ReadAsByteArrayAsync();
                    return jbyte;
                }
            }
            return null;
        }

        private string ToJson(object obj)
        {
            return obj == null ? string.Empty : JsonConvert.SerializeObject(obj);
        }
    }

    public partial interface IHttpClientEx
    {
        public Task<string> Get(string url, string token = default);
        public Task<Stream> GetFile(string url, string token = default);
        public Task<string> Put(string url, object obj, string token = default);
        public Task<string> Patch(string url, object obj, string token = default);
        public Task<string> Post(string url, object obj, string token = default);
        public Task<string> Delete(string url, string id, string token = default);
    }
}
