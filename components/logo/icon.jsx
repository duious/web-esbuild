const LogoIcon = ({ className, style, width = 14, height = 14, fill = '#21a2ff', color = 'currentColor' }) => {
    return (
        <span
            className={`${className} anticon anticon-chatbot`}
            role="img"
            aria-label="chatbot"
            style={style}
            width={`${width}px`}
            height={`${height}px`}
        >
            <svg
                width={`${width}px`}
                height={`${height}px`}
                viewBox="0 0 32 38"
                focusable="false"
                data-icon="chatbot"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="未命名的渐变_20"
                        x1="43.76"
                        y1="49.19"
                        x2="259.81"
                        y2="49.19"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.46" stopColor="#fff" />
                        <stop offset="1" stopColor="#7c7c7c" />
                    </linearGradient>
                    <linearGradient
                        id="未命名的渐变_20-2"
                        x1="54.85"
                        y1="49.19"
                        x2="270.9"
                        y2="49.19"
                        xlinkHref="#未命名的渐变_20"
                    />
                </defs>
                <path
                    fill={color || fill}
                    d="M90.12,36c-.27-.1-.54-.17-.81-.25V31a1.83,1.83,0,1,0-2.09,0v4.15a23.31,23.31,0,0,0-10.29,0V31a1.83,1.83,0,1,0-2.1,0v4.78l-.44.13a35,35,0,0,0-8.26,4.53V58a35.24,35.24,0,0,0,8.26,4.52,23.84,23.84,0,0,0,15.73-.07A31.43,31.43,0,0,0,98,58V40.43A31.18,31.18,0,0,0,90.12,36Zm4.34,19.24a44.6,44.6,0,0,1-5.32,1.67,32.46,32.46,0,0,1-7.4.81,33.07,33.07,0,0,1-12-2.39V43.08a33.07,33.07,0,0,1,12-2.39,31.9,31.9,0,0,1,7.4.82,42.72,42.72,0,0,1,5.32,1.66Z"
                    transform="translate(-66.13 -27.69)"
                />
                <path
                    style={{ fill: color || 'url(#未命名的渐变_20)' }}
                    d="M76.54,45.58a3.61,3.61,0,1,0,3.61,3.61A3.61,3.61,0,0,0,76.54,45.58Z"
                    transform="translate(-66.13 -27.69)"
                />
                <path
                    style={{ fill: color || 'url(#未命名的渐变_20-2)' }}
                    d="M84,49.19a3.61,3.61,0,1,0,3.61-3.61A3.61,3.61,0,0,0,84,49.19Z"
                    transform="translate(-66.13 -27.69)"
                />
            </svg>
        </span>
    )
}

export default LogoIcon
