import { JSX } from "preact"

interface ResponsiveImgProps extends JSX.HTMLAttributes<HTMLImageElement> {
    srcName: string
}

export function ResponsiveImg(props: ResponsiveImgProps) {
    const {srcName, class: className, ...rest} = props;

    const srcSet = `${srcName}-md.webp 480w, ${srcName}-lg.webp 800w`

    const sizes = `(max-width: 768px) 480px, 800px`

    const src = `${srcName}.png`

    return <div class="relative">
        <img src={`${srcName}-xs.webp`} class="absolute top-0 left-0 h-full filter blur-2xl transform origin-center scale-100" />
        <img srcSet={srcSet} sizes={sizes} src={src} class={"relative max-h-96 " + className} {...rest}  />
    </div> 
}