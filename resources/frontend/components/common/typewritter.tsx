import Typewriter from 'typewriter-effect';

export default function TypewriterComponent({ text, delay }: any) {
    return (
        <Typewriter
            options={{
                strings: `${text}`,
                delay: 15,
                autoStart: true,
                loop: false
            }}
        />
    );
}
