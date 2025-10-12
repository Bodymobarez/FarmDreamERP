import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = url.startsWith('http') ? url : API_BASE_URL + url;
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Get API base URL from environment or use relative path
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = API_BASE_URL + queryKey.join("/");
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: 30000, // تحديث كل 30 ثانية
      refetchOnWindowFocus: true, // تحديث عند العودة للصفحة
      staleTime: 5000, // البيانات تعتبر قديمة بعد 5 ثواني
      retry: false,
    },
    mutations: {
      retry: false,
      onSuccess: () => {
        // إعادة تحديث جميع الاستعلامات بعد نجاح أي mutation
        queryClient.invalidateQueries();
      },
    },
  },
});
