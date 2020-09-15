<template>
    <v-card>
        <VueSignaturePad
            ref="signaturePad"
            id="signature"
            width="100%"
            height="500px"
            :options="options"
        />
        <v-btn
            @click="stopRecording"
            v-if="mediaRecorder && mediaRecorder.state === 'recording'"
        >Stop</v-btn>
        <v-btn @click="startRecording" v-else>Start</v-btn>
        <v-btn @click="clearSignature">Clear</v-btn>
        <video ref="video" />
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            stream: null,
            recordedBlobs: [],
            canvas: null,
            mediaRecorder: null,
            options: {
                penColor: "#c0f",
            },
        };
    },
    methods: {
        clearSignature() {
            this.$refs.signaturePad.clearSignature();
        },
        async submitSignature(blobUrl) {
            this.$emit("newSignature", blobUrl);
            this.$refs.signaturePad.clearSignature();
        },

        ///RECORDING METHODS FOR FUTURE USE

        startRecording() {
            const options = { mimeType: "video/webm" };
            this.mediaRecorder = new MediaRecorder(this.stream, options);

            console.log(
                "Created MediaRecorder",
                this.mediaRecorder,
                "with options",
                options
            );
            this.mediaRecorder.onstop = this.handleStop;
            this.mediaRecorder.ondataavailable = this.handleDataAvailable;
            this.mediaRecorder.start(100); // collect 100ms of data
            console.log("MediaRecorder started", this.mediaRecorder);
        },
        stopRecording() {
            this.mediaRecorder.stop();
            console.log("Recorded Blobs: ", this.recordedBlobs);
            this.$refs.video.controls = true;
        },
        handleDataAvailable(event) {
            if (event.data && event.data.size > 0) {
                this.recordedBlobs.push(event.data);
            }
        },
        async handleStop(event) {
            console.log("Recorder stopped: ", event);
            const superBuffer = new Blob(this.recordedBlobs, {
                type: "video/webm",
            });
            this.$refs.video.src = window.URL.createObjectURL(superBuffer);
            this.submitSignature(await this.blobToDataURL(superBuffer));
        },
        blobToDataURL(blob) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(blob);
            });
        },
    },
    mounted() {
        this.canvas = this.$refs.signaturePad.$el.querySelector("canvas");
        this.stream = this.canvas.captureStream();
    },
};
</script>

<style>
</style>
