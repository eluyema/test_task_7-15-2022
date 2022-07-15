import { useEffect, useState } from 'react';
import './App.css';
import { getApi } from './getApi';

const get_api_url = {
  terms: 'https://onboarding.art-code.team/api/test/v1/search/terms',
  styles: 'https://onboarding.art-code.team/api/test/v1/search/styles',
  brands: 'https://onboarding.art-code.team/api/test/v1/search/brands_terms'
}

const prefix = {
  terms: 's-',
  styles: 'st-',
  brands: 'b-',
}

function App() {
  const [styles, setStyles]=useState([]);
  const [brands, setBrands]=useState([]);
  const [terms, setTerms]=useState([]);

  const [currStyle, setCurrStyle]=useState();
  const [currBrand, setCurrBrand]=useState();
  const [currTerm, setCurrTerm]=useState();

  const updatePathname = ({style, brand, term})=>{
    let newPathname = '';
    if(term){
      newPathname+='/'+prefix.terms+term;
    }
    if(brand){
      newPathname+='/'+prefix.brands+brand;
    }
    if(style){
      newPathname+='/'+prefix.styles+style;
    }

    window.location.pathname = newPathname;
  }

  useEffect(()=>{
  const setOptions = async ()=>{
      try {

          const pathname = window.location.pathname;
        const slugs = pathname.split('/').slice(1);
        const urlSelectedValues = {}
        slugs.forEach(slug=>{
          if(slug.slice(0, prefix.styles.length).includes(prefix.styles)){
            urlSelectedValues.style = slug.slice(prefix.styles.length)
          }
          else if(slug.slice(0, prefix.brands.length).includes(prefix.brands)){
            urlSelectedValues.brand = slug.slice(prefix.brands.length)
          }
          else if(slug.slice(0, prefix.terms.length).includes(prefix.terms)){
            urlSelectedValues.term = slug.slice(prefix.terms.length)
          }
        })
        

        const fetchedStyles = await getApi(get_api_url.styles);
        setStyles(fetchedStyles.data);
        const isUrlStyleContained = !fetchedStyles.data.every(style=>style.slug!==urlSelectedValues.style);
        if(isUrlStyleContained){
          setCurrStyle(urlSelectedValues.style)
        }

        const fetchedBrands = await getApi(get_api_url.brands);
        setBrands(fetchedBrands.data);
        const isUrlBrandContained = !fetchedBrands.data.every(brand=>brand.slug!==urlSelectedValues.brand);
        if(isUrlBrandContained){
          setCurrBrand(urlSelectedValues.brand)
        }

        const fetchedTerms = await getApi(get_api_url.terms); 
        setTerms(fetchedTerms.data);
        const isUrlTermContained = !fetchedTerms.data.every(term=>term.slug!==urlSelectedValues.term);
        if(isUrlTermContained){
          setCurrTerm(urlSelectedValues.term)
        }

      } catch (error) {
        alert('Something went wrong 😢')
      }
    }
  setOptions();
  },[])

  const onChangeStyle = (event)=> {
    setCurrStyle(event.target.value);
    updatePathname({style: event.target.value, brand: currBrand, term: currTerm});
  }
  const onChangeBrand = (event)=> {
    setCurrBrand(event.target.value);
    updatePathname({style: currStyle, brand: event.target.value, term: currTerm});

  }
  
  const onChangeTerm = (event)=> {
    setCurrTerm(event.target.value);
    updatePathname({style:currStyle , brand: currBrand, term: event.target.value});
  }
  return (
    <div className="App">
      <select value={currStyle} defaultValue="default" onChange={onChangeStyle}>
        <option value="default" disabled>
          Select style
        </option>
        {styles.map((style)=>
          <option 
            key={style.id}
            value={style.slug}>{
              style.label
            }</option>)
          }
      </select>
      <select value={currBrand} defaultValue="default" onChange={onChangeBrand}>
        <option value="default" disabled>
          Select brand
        </option>
        {brands.map((brand)=>
          <option 
            key={brand.id}
            value={brand.slug}>{
              brand.label
            }</option>)
          }
      </select>
      <select value={currTerm}  defaultValue="default" onChange={onChangeTerm}>
        <option value="default" disabled>
          Select Term
        </option>
        {terms.map((terms)=>
          <option 
            key={terms.id}
            value={terms.slug}>{
              terms.label
            }</option>)
          }
      </select>

    </div>
  );
}

export default App;
