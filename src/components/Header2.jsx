export default function Header2(
    {
        imagePath,
        headerText,
        size
    }
) {
    return (<>
        <div className='d-flex flex-column flex-md-row d-flex align-items-center justify-content-start text-center'> 
            <div className=' rounded d-flex align-items-center justify-content-center' >
                <img src={imagePath} alt="" height={size} className="me-2" />
            </div>
            <h5 className='my-0'> {headerText} </h5>
        </div>
    </>)
}
