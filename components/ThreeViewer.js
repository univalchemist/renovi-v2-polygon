import { Suspense } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Html, useProgress, Environment, OrbitControls, Stars } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader"
import { VRMLLoader } from "three/examples/jsm/loaders/VRMLLoader"

const Loader = () => {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
}

const Model = (props) => {
    const { modelFile } = props;

    let _model;
    if (modelFile?.ext === "obj") {
        _model = useLoader(OBJLoader, modelFile.path);
        return (
            <>
                <primitive object={_model} scale={0.4} />
            </>
        );
    } else if (modelFile?.ext === "stl") {
        _model = useLoader(STLLoader, modelFile.path);
        // _model = useLoader(STLLoader, "/test_3d/Eiffel_tower_sample.STL");
        return (
            <>
                <mesh>
                    <primitive object={_model} scale={1} attach="geometry"/>
                    <meshStandardMaterial color="white"/>
                </mesh>

            </>
        );
    } else if (modelFile?.ext === "gltf") {
        _model = useLoader(GLTFLoader, modelFile.path);
        return (
            <>
                <primitive object={_model.scene} scale={0.6} />
            </>
          );
    } else if (modelFile?.ext === "fbx") {
        // _model = useLoader(FBXLoader, "/test_3d/Room.fbx");
        _model = useLoader(FBXLoader, modelFile.path);
        return (
            <>
                <mesh>
                    <primitive object={_model} scale={0.5}/>
                </mesh>

            </>
        )
    } else if (modelFile?.ext === "dae") {
            _model = useLoader(ColladaLoader, modelFile.path);
            return (
                <>
                <mesh>
                    <primitive object={_model.scene} />
                </mesh>
                </>
            )
    } else if (modelFile?.ext === "wrl") {
        _model = useLoader(VRMLLoader, modelFile.path);
        return (
            <>
                <primitive object={_model} />
            </>
        )
    } else {
        return;
    }
};

const ThreeViewer = (props) => {
    return (
        <Canvas style={{ background: "" }} camera={{ position: [0, 10, 100] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 60, -100]} intensity={20} />
            <pointLight position={[-50, 0, -50]} intensity={2} />
            <pointLight position={[60, -30, 60]} intensity={2} />
            <spotLight castShadow intensity={8} angle={Math.PI / 10} position={[10, 10, 10]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />

            {/* <Stars/> */}
            <Suspense fallback={<Loader />}>
                <Model modelFile={props.modelFile} />
            </Suspense>
            <OrbitControls />
        </Canvas>
    )
}

export default ThreeViewer;
