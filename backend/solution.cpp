#include <bits/stdc++.h>
using namespace std;

int main() {
  int n, sum; cin >> n >> sum;
  vector<int> a(n);
  for(auto &it : a) cin >> it;
  map<int, queue<int>> mp;
  for(int i =  0; i < n; i++) {
      mp[a[i]].push(i);
  }
  for(int i = 0; i < n; i++) {
      int r = sum - a[i];
      while(!mp[r].empty() && mp[r].front() <= i) mp[r].pop();
      if(!mp[r].empty()) {
          cout << i << " " << mp[r].front() << endl;
          return 0;
      }
  }
  cout << "-1 -1" << endl;
  
  return 0;
}