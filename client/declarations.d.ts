declare module '*.module.less' {
  interface Style {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    toString?(): string;
  }

  const content: Style;
  export default content;
}