const textToImage = async (query: string): Promise<string> => {
  /* Wrapper for whatever AI API we land on */
  console.log(query);
  return await Promise.resolve("https://i.imgur.com/DdYh6b7.jpeg");
};

export { textToImage };
