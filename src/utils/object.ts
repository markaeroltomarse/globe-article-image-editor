export const objectToQueryString = (params: Record<string, any>): string => {
    const queryString = Object.keys(params)
      .map((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        return '';
      })
      .filter((param) => param !== '')
      .join('&');
  
    return queryString ? `?${queryString}` : '';
  };