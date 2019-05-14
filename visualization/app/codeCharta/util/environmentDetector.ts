export class EnvironmentDetector{
    public static isNodeJs() {
        return typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined'
    }
}