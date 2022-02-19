const CreateCollectible = () => {
    return (
        <section className="create-collectible-area container">
            <div className="row">
                <div className="col-12 col-md-8 col-lg-7">
                    {/* Intro */}
                    <div className="intro">
                        <h3 className="mt-3 mb-0">Create collectible</h3>
                        <p>Your collectible will be one of a kind. Click to start creating your NFT.</p>
                    </div>
                </div>
            </div>
            <div className="w-100">
                <div className="card create-collectible-card no-hover bg-transparent border border-secondary">
                    <img src="/images/bg/collectible.png" alt="" />
                    <h4 className="mb-0">Create Single NFT</h4>
                </div>
            </div>
            <div className="row">
                <p className="col-12 pt-5 mt-5">
                    We do not own your private keys and cannot acces your funds without your confirmation.
                </p>
            </div>
        </section>
    );
}

export default CreateCollectible;