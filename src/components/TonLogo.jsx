export default function TonLogo({ size = 40 }) {
    return (
        <img
            src="https://cryptologos.cc/logos/toncoin-ton-logo.png"
            alt="TON"
            style={{
                width: size,
                height: size,
                filter: "drop-shadow(0 0 6px #3b82f6)",
            }}
        />
    );
}
