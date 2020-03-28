import React from 'react';
import './App.css';
import { Layout } from 'antd';
import {CovidGlobe} from './components/CovidGlobe'
import 'tachyons';

const { Footer, Content} = Layout;

function App() {
  return (
    <Layout>
    <div class="header-specs">
    <h1 className="f1 white ph5 tc">Covid-19</h1>
    </div>
    <Content>
    <CovidGlobe />
    </Content>
    <Footer style={{ textAlign: 'center' }}>Created by <a href="https://github.com/rushivarun">Rushi Varun</a></Footer>
    </Layout>
  );
}

export default App;
