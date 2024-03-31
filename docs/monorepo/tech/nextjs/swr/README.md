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

- You can add optimizations to the `useSWR` hook:

```tsx
export const useUser = () => {
  const config: SWRConfiguration = {
    revalidateOnFocus: false, // revalidate when the window gets focused
    refreshInterval: 60000, // revalidate every minute
    revalidateOnReconnect: true, // revalidate when reconnecting to the network
    /* Some other good options */
    // dedupingInterval: 2000, // dedupe requests with the same key in this time span
    // focusThrottleInterval: 5000, // only revalidate once during a time span
    // loadingTimeout: 3000, // throw an error if the data is not updated after this time
  }

  const { ...query } = useSWR<User, Error>(path, config) // You need to pass the config object as the second argument ans third if you don't have global fetcher setup as above

  return {
    ...query,
  }
}
```

> ⚠️ These configurations can be added independently, as I'm doing here, or directly from the global fetcher in the
> SWRConfig context.

- Use the `useUser` hook in your component:

```tsx
const { data, error, isValidating } = useUser()
```
