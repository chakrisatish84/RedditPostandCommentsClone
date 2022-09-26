import { useCallback, useEffect, useState } from "react";

export function useAsync<T>(func: Function, dependencies?: any) {
    const { execute, ...state } = useAsyncInternal<T>(func, dependencies, true);

    useEffect(() => { execute() }, [execute])

    return state;
}

export function useAsycFn<T>(func: Function, dependencies?: any) {
    return useAsyncInternal(func, dependencies, false);
}

function useAsyncInternal<T>(func: Function, dependencies?: any, initialLoad = false) {
    const [isLoading, setIsLoading] = useState(initialLoad);
    const [error, setError] = useState();
    const [value, setValue] = useState<T>();

    const execute = useCallback(async (...parms: any) => {
        setIsLoading(true);
        try {
            const data: T = await func(...parms);
            setValue(data);
        }
        catch (error: any) {
            setError(error);
            return Promise.reject(error);
        }
        finally {
            setIsLoading(false);

        }
    }, [dependencies])

    return { isLoading, error, value, execute }
}