// 客户端 Sanity API 查询工具
const SANITY_PROJECT_ID = 'k2j30muc';
const SANITY_DATASET = 'production';

export async function fetchSanityClient<T>(query: string): Promise<T> {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}
