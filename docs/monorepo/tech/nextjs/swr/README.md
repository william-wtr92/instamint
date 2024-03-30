# 💾 SWR

> SWR is a React Hooks library for remote data fetching.

> On Instamint we use SWR to fetch data from the server and cache it locally, revalidating the data when the page is
> focused.

## 📚 Resources

- [📖 SWR](https://swr.vercel.app/)
- [📖 SWR for TypeScript](https://swr.vercel.app/docs/typescript)
- [📖 SWR Global Configuration](https://swr.vercel.app/docs/global-configuration)

## 💡 How to use SWR

### ⚙️ Global Configuration

Create a new file called `fetcher.ts` in the `utils` folder and add the following configuration:

```ts
const createApiClient = ({ baseURL }) => {
  return axios.create({
    baseURL,
  })
}

const api = createApiClient({ baseURL: YourBaseURL })
export const globalFetcher = (url: string) =>
  api.get(url).then((res) => res.data)
```

- Update your `_app.tsx` file to include the following configuration:

```tsx
import type { AppProps } from "next/app"
import { SWRConfig } from "swr"
import { globalFetcher } from "@/web/services/globalFetcher"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig value={{ fetcher: globalFetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
```

### 🔨 Usage

- Import the `useSWR` hook from the `swr` package:

```tsx
import useSWR from "swr"
```

- Use the `useSWR` hook to fetch data from the server:

```tsx
type User = {
  // Define the type of the data you are fetching
  id: string
  name: string
}

export const useUser = () => {
  const { ...query } = useSWR<User, Error>(path) // With global config see below you don't need to pass fetcher

  return {
    ...query, // data, error, isValidating
  }
}
```

- Use the `useUser` hook in your component:

```tsx
const { data, error, isValidating } = useUser()
```
