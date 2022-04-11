import { gapi } from "gapi-script";
import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import useDrivePicker from "react-google-drive-picker";

const SCOPES = 'https://www.googleapis.com/auth/drive' 
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFetchingGoogleDriveFiles,setIsFetchingGoogleDriveFiles]=useState(false)
  const[documents,setDocuments] = useState([])
  const [listDocumentsVisibility,setListDocumentsVisibility] = useState(false)
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: SCOPES,
        discoveryDocs:DISCOVERY_DOCS
      })
    }
    gapi.load('client:auth2',start)
  },[])
  const createFile = (tag) => {
    let accessToken = gapi.auth.getToken().access_token;

    fetch('https://docs.googleapis.com/v1/documents',{
      method: 'POST',
      headers: new Headers({'Authorization': `Bearer ${accessToken}`}),
    }).then((res) => res.json).then((data)=>{
      console.log(data)
      console.log(data.documentId)
    })
  }
  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.REACT_APP_CLIENT_ID,
      developerKey: process.env.REACT_APP_API_KEY,
      viewId: 'DOCS',
      token:gapi.auth.getToken().access_token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
    })
  }

  const listFiles = (searchTerm = null) => {
    gapi.client.drive.files
      .list({ fields: 'nextPageToken, files(id, name, parents, mimeType, modifiedTime,thumbnailLink,iconLink,hasThumbnail,webContentLink,webViewLink)',q:"'root' in parents" })
      .then(function (response) {
        const res = JSON.parse(response.body);
        setDocuments(res?.files);
        console.log(res)
      });
  };
  console.log(documents)
  useEffect(() => {
    if (data) {
      data.docs.map(i=>console.log(i))
    }
  },[data])

  return (
    <div className="App">
     <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
     {
       isLoggedIn?
       <>
     <button onClick={() => createFile('New File') }>Create File</button>
     <button onClick={handleOpenPicker}>Open Picker</button>
     <button onClick={listFiles}>Get Files</button>
    
       </>:''
     }
     {
        isFetchingGoogleDriveFiles? <>fetching</>:
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
          gridGap:'10px'
        }}>

          {documents.map(i=>
          <div style={{
            display:'flex',
            backgroundColor:'#eee',
            borderRadius:'5px',
            padding:'10px',
            gap:'10px',
            cursor:'pointer'
          }}
            onClick={()=>i.webViewLink?window.open(i.webViewLink):''}
          >
            <img src={i.iconLink} width={20} height={25}/>
            {i.name}
          </div>)}
        </div>
     }
    </div>
  );
}

export default App;
