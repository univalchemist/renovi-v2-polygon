import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as API from '../../utils/Api';
import Router from 'next/router'
import { FILTER_CATEGORIES } from '../../Constants';
import { pinFileToIPFS, pinJSONToIPFS } from '../../utils/Pinata';
import { AVAILABLE_METAVERSES } from '../../Constants';
import { Multiselect } from "multiselect-react-dropdown";
import { useRef } from 'react';


const ItemForm = (props) => {
    const dispatch = useDispatch();
    const [processing, setProcessing] = useState(false);
    const [image, setImage] = useState(null);
    const [otherFiles, setOtherFiles] = useState([]);
    const [availableOnMetaverses, setAvailableOnMetaverses] = useState([]);
    const [availableOnMetaversesSelection, setAvailableOnMetaversesSelection] = useState([]);
    const [preview, setPreview] = useState("");
    const [data, setData] = useState({
        categories: FILTER_CATEGORIES[0].value,
        name: "",
        description: "",
        price: "",
        status: 1,
        image: "",
        // availableOn: "",
        numberOfParcels: 0,
        files: [],
    });

    const availableOnRef = useRef();


    const stateWallet = useSelector(state => state.wallet);

    useEffect(() => {
        if (!stateWallet.address) {
            props.onNotify('error', 'Connect Metamask Wallet!');
        }
    }, [stateWallet.address]);

    useEffect(() => {
        if (props.itemData?.id) {
            setData({
                categories: props.itemData.categories,
                name: props.itemData.name,
                description: props.itemData.description,
                price: props.itemData.price_in_eth,
                status: props.itemData.status,
                image: props.itemData.image,
                otherfiles: props.itemData.otherfiles,
                numberOfParcels: props.itemData.numberOfParcels
            });
            setPreview(props.itemData.image);

            if (props.itemData.availableOn) {
                // set values for processing
                setAvailableOnMetaverses(props.itemData.availableOn)
                // set preselected values for editing array
                setAvailableOnMetaversesSelection(
                    props.itemData.availableOn.map(
                        metaverse => { return {"name": metaverse, "value": metaverse} }
                    )
                )
            }

            // setOtherFiles(props.itemData.otherfiles);
        }
    }, [props.itemData]);

    const handleImageChange = (e) => {
        if (!e.target.files?.length) {
            return;
        }
        setImage(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleOtherFilesChange = (e) => {
        if (!e.target.files?.length) {
            return;
        }
        const _other_files = [];
        for (let fi of e.target.files) {
            _other_files.push(fi);
        }
        setOtherFiles(_other_files);
    }

    const handleAvailableOnChange = (e) => {
        setAvailableOnMetaverses(e.map(arrayValues => arrayValues.name))
    }

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleCreate = async() => {
        setProcessing(true);
        dispatch({
            type: 'SET_PROCESSING',
            data: true
        });
        try {
            const { success, pinataUrl: img_path } = await pinFileToIPFS(image)
            const other_files = [];
            if (otherFiles?.length > 0) {
                for (let _file of otherFiles) {
                    const { success, pinataUrl: file_path } = await pinFileToIPFS(_file);
                    const file_names = _file.name.split('.');
                    other_files.push({path: file_path, name: _file.name, ext: file_names[file_names.length-1]});
                }
            }

             // make metadata
            const metadata = new Object();
            metadata.name = data.name;
            metadata.image = img_path;
            metadata.description = data.description;
            metadata.availableOn = availableOnMetaverses;
            metadata.numberOfParcels = data.numberOfParcels;
            const { pinataUrl: metadata_uri} = await pinJSONToIPFS(metadata);

            const nft_data = {
                status: data.status,
                account: stateWallet.address,
                price: data.price,
                token_uri: metadata_uri
            };

            const tokenId = await API.mintNFT(nft_data);
            if (parseInt(tokenId) > 0) {
                const result = await API.saveTokenMetadata({
                    tokenId,
                    name: data.name,
                    description: data.description,
                    image: img_path,
                    categories: data.categories,
                    otherfiles: other_files,
                    availableOn: availableOnMetaverses,
                    numberOfParcels: data.numberOfParcels
                });

                const token_data = await API.getTokenDetailById(tokenId);
                dispatch({
                    type: "CREATE_ITEM",
                    data: token_data
                });
                props.onNotify('success', 'Created your NFT successfully!');
                props.onClose();
            }

        } catch (e) {
            props.onNotify('error', e.message);
        }
        setProcessing(false);
        dispatch({
            type: 'SET_PROCESSING',
            data: false
        });
    }

    const handleUpdate = async() => {
        setProcessing(true);
        dispatch({
            type: 'SET_PROCESSING',
            data: true
        });
        try {
            const other_files = [];
            if (otherFiles?.length > 0) {
                for (let _file of otherFiles) {
                    const { success, pinataUrl: file_path } = await pinFileToIPFS(_file);
                    const file_names = _file.name.split('.');
                    other_files.push({path: file_path, name: _file.name, ext: file_names[file_names.length-1]});
                }
            }

            let nft_data = {...data, id: props.itemData?.id, account: stateWallet.address};
            if (image) {
                const { pinataUrl: img_path } = await pinFileToIPFS(image);
                nft_data = { ...nft_data, image: img_path, };
            }
            const result = await API.updateNFT(nft_data);
            let dbResult;

            if (result){
                dbResult = await API.updateTokenMetadata({
                    tokenId: result.id,
                    name: data.name,
                    description: data.description,
                    image: nft_data.image,
                    categories: data.categories,
                    otherfiles: other_files,
                    availableOn: availableOnMetaverses,
                    numberOfParcels: data.numberOfParcels
                });

            }

            if (dbResult) {
                dispatch({
                    type: "UPDATE_ITEM",
                    data: result
                });
                if (props.onUpdated) {
                    props.onUpdated(result);
                }
                props.onNotify('success', 'Updated your NFT successfully.');
                props.onClose();
            } else {
                props.onNotify('error', 'Failed to update your item. Please try again later');
            }
        } catch (e) {
            props.onNotify('error', e.message);
        }
        setProcessing(false);
        dispatch({
            type: 'SET_PROCESSING',
            data: false
        });
        // Router.reload(window.location.pathname);
    }

    const handleCancel = () => {
        props.onClose();
    }

    // const renderFileItems = () => {
    //     if (otherFiles?.length > 0) {
    //         const items = otherFiles.map((fi, idx) => (<p key={idx}>{fi.name}</p>));
    //         return items;
    //     } else {
    //         return;
    //     }
    // }

    return (
        <>
            <form className="rnvi-form card no-hover pt-3 pb-5">
                <div className="row">
                    <h5 className="col-12 border-bottom pb-3">
                    {
                        props.itemData?.id? "Edit Item":"Create Item"
                    }
                    </h5>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_status">Category</label>
                            <select className="form-control" id="item_categories" name="categories"
                                value={data.categories}
                                onChange={(e)=>handleChange(e)} >
                                {
                                    FILTER_CATEGORIES.map((cat, idx) => {
                                        return (<option key={idx} value={cat.value}>{cat.name}</option>)
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_name">Name</label>
                            <input type="text" className="form-control" id="item_name" name="name" placeholder="Enter name" required="required"
                                value={data.name}
                                onChange={(e)=>handleChange(e)} />
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_description">Description</label>
                            <textarea className="form-control" name="description" id="item_description" placeholder="Enter description"
                                cols={30} rows={3} required="required"
                                value={data.description}
                                onChange={(e)=>handleChange(e)} />
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_price">Price</label>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">MATIC</span>
                                <input type="text" className="form-control" name="price" id="item_price" placeholder="Enter Price" required="required"
                                    value={data.price}
                                    onChange={(e)=>handleChange(e)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_status">Status</label>
                            <select className="form-control" id="item_status" name="status"
                                value={data.status}
                                onChange={(e)=>handleChange(e)} >
                                <option value="1">Put for sale</option>
                                <option value="0">Not for sale</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_available_on">Available On</label>
                            <Multiselect options={AVAILABLE_METAVERSES}
                                        displayValue="name"
                                        ref={availableOnRef}
                                        onSelect={(e)=>handleAvailableOnChange(e)}
                                        value={data.availableOn}
                                        selectedValues={availableOnMetaversesSelection}
                             />

                            {/* <select className="form-control" id="item_available_on" name="availableOn"
                                value={data.availableOn}
                                onChange={(e)=>handleChange(e)} >
                                    {AVAILABLE_METAVERSES.map(metaverseData => (
                                        <option value={metaverseData.value}>{metaverseData.name}</option>

                                    ))}
                            </select> */}
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_number_of_parcels">Number of Parcels</label>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" name="numberOfParcels" id="item_number_of_parcels" placeholder="Enter number of parcels" required="required"
                                    value={data.numberOfParcels}
                                    onChange={(e)=>handleChange(e)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="d-flex">
                            <div className="form-group">
                                <label htmlFor="item_preview">Preview Image<span className="small text-secondary"> (PNG, JPEG only)</span></label>
                                <input type="file" accept="image/*" className="form-control-file" id="item_preview"
                                    onChange={(e)=>handleImageChange(e)} />
                            </div>
                            {
                                preview && (<img src={preview} className="image-preview" />)
                            }
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label htmlFor="item_other">Other<span className="small text-secondary mb-0"> (PDF, MP4, OBJ, COLLADA, FBX, STL, VRLM, GLTF)</span></label>
                            <label className="small text-secondary mt-0">Any other format can be uploaded in a ZIP file</label>
                            <input type="file" accept=".zip, .pdf, .stl,.obj,.mp4,.avi,.fbx,.gltf,.dae, .wrl" className="form-control-file" id="item_other"
                                multiple
                                onChange={(e)=>handleOtherFilesChange(e)} />
                        </div>
                    </div>
                    <div className="col-12 border-top pt-4 pb-5 text-end">
                        <a href="#" className="btn btn-secondary me-3 px-4 py-2"
                            onClick={()=>handleCancel()}
                        >Cancel</a>
                        {
                            props.itemData?.id? (
                                <button className={`btn btn-primary-alt px-4 py-2 ${processing?"processing": ""}`} type="button"
                                    onClick={()=>handleUpdate()}
                                    disabled={processing? "disabled": ""}
                                >
                                    Update
                                </button>
                            ):(
                                <button className={`btn btn-primary-alt px-4 py-2 ${processing?"processing": ""}`} type="button"
                                    onClick={()=>handleCreate()}
                                    disabled={processing? "disabled": ""}
                                >
                                    Create
                                </button>
                            )
                        }
                    </div>
                </div>
            </form>
        </>
    );
}

export default ItemForm;