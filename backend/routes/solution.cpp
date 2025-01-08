#include <bits/stdc++.h>
using namespace std;
using ll = long long;
#define int long long

ll mo = 1e9 + 7;
ll modu(ll a) {return ((a % mo) + mo) % mo;}
ll add(ll a, ll b) { return modu(modu(a) + modu(b)); }
ll mul(ll a, ll b) { return modu(modu(a) * modu(b)); }
ll mpow(ll a, ll p) {
    ll res = 1;
    while(p) res = (p & 1) ? mul(res, a) : res, a = mul(a, a), p >>= 1;
    return res;
}
ll minv(ll a) { return mpow(a, mo - 2); }
ll gcd(ll a, ll b) { return b == 0 ? a : gcd(b, a % b); }
template <typename T>
void print(const T &a){for(const auto&it:a)cout<<it<<" ";cout<<endl;}

using pi = pair<int, int>;
int mx = 1e6;

void solve() {
    int n, sum = 0;
    cin >> n >> sum;
    vector<int> a(n);
    map<int, queue<int>> mp;
    for(int i = 0; i < n; i++) {
      cin >> a[i];
      mp[a[i]].push(i);
    }
    for(int i = 0; i < n; i++) {
      // for(int j = i + 1; j < n; j++) {
      //   if(a[i] + a[j] == sum) {
      //     cout << i << " " << j << endl;
      //     return;
      //   }
      // } continue;
      int r = sum - a[i];
      while(!mp[r].empty() && mp[r].front() <= i) mp[r].pop();
      if(!mp[r].empty()) {
        cout << i << " " << mp[r].front() << endl;
        return;
      }
    }
    cout << "-1 -1 " << endl;
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr); cout.tie(nullptr);
    int t = 1;
    // cin >> t;
    while(t--) solve();
    return 0;
}