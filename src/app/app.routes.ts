import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { LoginPage } from './login-page/login-page';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { ExplorePage } from './explore-page/explore-page';
import { WriteBlog } from './write-blog/write-blog';
import { EditBlog } from './edit-blog/edit-blog';
import { ReadBlog } from './read-blog/read-blog';

export const routes: Routes = [
    {
        path: "",
        component:HomePage
    },
    {
        path: "admin/login",
        component:LoginPage
    },
    {
        path: "admin/dashboard",
        component:AdminDashboard
    },
    {
        path: "explore",
        component:ExplorePage
    },
    {
        path: "write",
        component:WriteBlog
    },
    { 
        path: 'admin/edit/:id',
        component: EditBlog 
    },
    { 
        path: 'blog/:id',
        component: ReadBlog 
    },

    {
        path: "**",
        component:HomePage
    },

];
