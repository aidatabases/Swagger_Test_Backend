import Vue from 'vue'
import Router from 'vue-router'
import lazyLoading from './lazyLoading'
import store from '@/store/store'

Vue.use(Router)

const AppLayout = () => import('@/views/AppLayout')

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'home',
      path: '/home',
      props: true,
      component: lazyLoading('views/Home')
    },
    {
      path: '/login',
      name: 'login',
      component: lazyLoading('views/Login')
    },
    {
      path: '/logout',
      name: 'logout',
      component: lazyLoading('views/Logout')
    },
    {
      path: '/dashboard',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: lazyLoading('views/Dashboard'),
          props: true,
          meta: {
            breadCrumb: 'Dashboard',
            breadcrum: [
              { 'name': 'Dashboard', 'link_name': 'dashboard' }
            ]
          }
        }
      ]
    },
    {
      path: '/public-ips',
      component: AppLayout,
      props: true,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: 'list-public-ips',
          path: 'list',
          component: lazyLoading('components/public_ip/AllotedList'),
          props: true
        },
        {
          name: 'request-public-ip',
          path: 'request',
          component: lazyLoading('components/public_ip/Request'),
          props: true
        }
      ]
    },
    {
      path: '/virtual-machines',
      component: AppLayout,
      props: true,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'create',
          component: lazyLoading('views/VirtualMachineCreate'),
          props: true,
          meta: {
            breadCrumb: 'Create',
            breadcrum: [
              { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
              { 'name': 'Create', 'link_name': 'virtual-machines/create', link_params: [] }
            ]
          }
        },
        {
          path: '',
          name: 'virtual-machines',
          component: lazyLoading('views/VirtualMachines'),
          props: true,
          meta: {
            breadCrumb: 'Virtual Machines',
            breadcrum: [
              { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' }
            ]
          }
        }
      ]
    },
    {
      path: '/virtual-machine/:computeId',
      component: AppLayout,
      props: true,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          component: lazyLoading('views/VirtualMachineDetails'),
          props: true,
          name: 'virtual-machine-details',
          meta: {
            breadcrum: [
              { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
              { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
            ]
          },
          children: [
            {
              path: 'volumes',
              component: lazyLoading('components/VirtualMachineDetailVolumes'),
              props: true,
              name: 'virtual-machine-details-volumes',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'resize',
              component: lazyLoading('components/VirtualMachineDetailResize'),
              props: true,
              name: 'virtual-machine-details-resize',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'snapshots',
              component: lazyLoading('components/VirtualMachineDetailSnapshots'),
              props: true,
              name: 'virtual-machine-details-snapshots',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'networks',
              component: lazyLoading('components/VirtualMachineDetailNetworks'),
              props: true,
              name: 'virtual-machine-details-networks',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'security-groups',
              component: lazyLoading('components/VirtualMachineDetailSecurityGroups'),
              props: true,
              name: 'virtual-machine-details-security-groups',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'console',
              component: lazyLoading('components/VirtualMachineDetailConsole'),
              props: true,
              name: 'virtual-machine-details-console',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'console-logs',
              component: lazyLoading('components/VirtualMachineDetailConsoleLog'),
              props: true,
              name: 'virtual-machine-details-console-logs',
              meta: {
                breadcrum: [
                  { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' },
                  { 'name': 'Details', 'link_name': 'virtual-machines/detail/:section', link_params: [] }
                ]
              }
            },
            {
              path: 'backup-services',
              component: lazyLoading('components/VirtualMachineDetailBackupServices'),
              props: true,
              name: 'virtual-machine-details-backup-services',
              children: [
                {
                  path: '',
                  component: lazyLoading('components/backups/ServiceList'),
                  props: true,
                  name: 'virtual-machine-details-backup-list'
                },
                {
                  path: 'create',
                  component: lazyLoading('components/backups/ServiceCreate'),
                  props: true,
                  name: 'virtual-machine-details-backup-create'
                }
              ]
            },
            {
              path: ':serviceId/backups',
              component: lazyLoading('components/backups/BackupList'),
              props: true,
              name: 'virtual-machine-details-backup-services-list-backups'
            }
          ]
        }
      ]
    },
    {
      path: '/scaling-groups',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'scaling-groups',
          component: lazyLoading('views/ScalingGroups'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Scaling Groups', 'link_name': 'scaling-groups' }
            ]
          }
        },
        {
          path: 'create',
          name: 'scaling-groups-scale',
          component: lazyLoading('views/ScalingGroupCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Scaling Groups', 'link_name': 'scaling-groups' },
              { 'name': 'Scale', 'link_name': 'scaling-groups/scale', link_params: [] }
            ]
          }
        },
        {
          path: 'virtual-machines/:computeId',
          component: lazyLoading('views/ScalingGroupVirtualMachineDetails'),
          props: true,
          name: 'scaling-group-virtual-machine-detail',
          meta: {
            breadcrum: [
              { 'name': 'Scaling Groups', 'link_name': 'scaling-groups' },
              { 'name': 'Virtual Machines', 'link_name': 'virtual-machines' }
            ]
          }
        }
      ]
    },
    {
      path: '/gateway',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'gateway',
          component: lazyLoading('views/Gateway'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Gateways', 'link_name': 'gateway' }
            ]
          }
        }
      ]
    },
    {
      path: '/security-groups',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'security-groups',
          component: lazyLoading('views/SecurityGroups'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Security Groups', 'link_name': 'security-groups' }
            ]
          }
        },
        {
          path: ':pSecurityGroupId/rules',
          name: 'security-group-rules',
          component: lazyLoading('views/SecurityGroupRulesList'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Security Group', 'link_name': 'security-groups' }
            ]
          }
        },
        {
          path: ':pSecurityGroupId/rules/create',
          name: 'security-group-rules-create',
          component: lazyLoading('views/SecurityGroupRulesCreate'),
          props: true
        }
      ]
    },
    {
      path: '/volumes',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'volumes',
          component: lazyLoading('views/Volumes'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Volumes', 'link_name': 'volumes' }
            ]
          }
        },
        {
          path: 'create',
          component: lazyLoading('views/VolumeCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Volumes', 'link_name': 'volumes' },
              { 'name': 'Create', 'link_name': 'volumes/create', link_params: [] }
            ]
          }
        }
      ]
    },
    {
      path: '/object-storage',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'objectStorage',
          component: lazyLoading('views/ObjectStorage'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Object Storage', 'link_name': 'object-storage' }
            ]
          }
        },
        {
          path: 'create',
          component: lazyLoading('views/VolumeCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Volumes', 'link_name': 'volumes' },
              { 'name': 'Create', 'link_name': 'volumes/create', link_params: [] }
            ]
          }
        }
      ]
    },
    {
      path: '/users',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'users',
          component: lazyLoading('views/Users'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Users', 'link_name': 'users' }
            ]
          }
        }
        /* {
          path: 'create',
          component: lazyLoading('views/UserCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Users', 'link_name': '' },
              { 'name': 'Create', 'link_name': '' }
            ]
          }
        } */
      ]
    },
    {
      path: '/roles',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'roles',
          component: lazyLoading('views/UserRoles'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Roles', 'link_name': 'roles' }
            ]
          }
        },
        {
          path: 'create',
          component: lazyLoading('views/UserRoleCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Roles', 'link_name': 'roles' },
              { 'name': 'Create', 'link_name': 'roles/create', link_params: [] }
            ]
          }
        }
      ]
    },
    {
      path: '/routers',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'routers',
          component: lazyLoading('views/Routers'),
          props: true
        },
        {
          path: 'create',
          component: lazyLoading('views/RouterCreate'),
          props: true
        }
      ]
    },
    {
      path: '/snapshots',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'snapshots',
          component: lazyLoading('views/Snapshots'),
          props: true
        },
        {
          path: 'create',
          component: lazyLoading('views/SnapshotCreate'),
          props: true
        }
      ]
    },
    {
      path: '/networks',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'networks',
          component: lazyLoading('views/Networks'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Networks', 'link_name': 'networks' }
            ]
          }
        },
        {
          path: 'create',
          component: lazyLoading('views/NetworkCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Networks', 'link_name': 'networks' }
            ]
          }
        },
        {
          path: '/network/:networkId',
          name: 'network-detail',
          component: lazyLoading('views/NetworkDetails'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Networks', 'link_name': 'networks' }
            ]
          }
        }
      ]
    },
    {
      path: '/projects',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'projects',
          component: lazyLoading('views/Projects'),
          props: true,
          meta: {
            breadCrumb: 'Projects'
          }
        },
        {
          path: 'create',
          component: lazyLoading('views/ProjectCreate'),
          props: true
        }
      ]
    },
    {
      path: '/action-logs',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'ActionLogs',
          component: lazyLoading('views/ActionLogs'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'ActionLogs', 'link_name': 'action-logs' }
            ]
          }
        },
        {
          path: 'create',
          component: lazyLoading('views/ProjectCreate'),
          props: true
        }
      ]
    },
    {
      path: '/packages',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'packages',
          component: lazyLoading('views/Packages'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Packages', 'link_name': 'packages' }
            ]
          }
        }
      ]
    },
    {
      path: '/load-balancers',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'LoadBalancers',
          component: lazyLoading('views/LoadBalancers'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Load Balancers', 'link_name': 'load-balancers' }
            ]
          }
        },
        {
          path: 'create',
          name: 'CreateLb',
          component: lazyLoading('views/LoadBalancerCreate'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Load Balancers', 'link_name': '' },
              { 'name': 'create', 'link_name': '', link_params: [] }
            ]
          }
        },
        {
          path: 'create-farm/:id',
          name: 'CreateFarm',
          component: lazyLoading('components/LoadBalancerCreateFarm'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Load Balancers', 'link_name': '' },
              { 'name': ':id', 'link_name': '', link_params: [] },
              { 'name': 'Farms', 'link_name': '', link_params: [] },
              { 'name': 'Create', 'link_name': '', link_params: [] }
            ]
          }
        },
        {
          path: 'view-farm/:farmId',
          name: 'ViewFarm',
          component: lazyLoading('components/LoadBalancerViewFarm'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Load Balancers', 'link_name': '' },
              { 'name': ':id', 'link_name': '', link_params: [] },
              { 'name': 'Farms', 'link_name': '', link_params: [] }
            ]
          }
        },
        {
          path: 'detail/:id',
          name: 'LbDetail',
          component: lazyLoading('views/LoadBalancerDetails'),
          props: true,
          meta: {
            breadcrum: [
              { 'name': 'Load Balancers', 'link_name': '' },
              { 'name': ':id', 'link_name': '', link_params: [] },
              { 'name': 'Farms', 'link_name': '', link_params: [] }
            ]
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    // spare login and allow user to go
    return next()
  }
  let authToken = store.getters['auth/token']
  if (!authToken) {
    router.push({ name: 'login' })
  } else {
    store.dispatch('auth/checkAuthToken', { token: authToken })
      .then(() => {
        next()
      })
      .catch(() => {
        router.push({ name: 'login' })
      })
  }
})
export default router
