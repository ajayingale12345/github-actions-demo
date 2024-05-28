const core =require('@actions/core');
const { exec } = require('@actions/exec');

const validateBranchName=({branchName})=> /^[a-zA-Z0-9_\.\/]+$/.test(branchName);
const validateDirectoryName=({dirName})=> /^[a-zA-Z0-9_\.\/]+$/.test(dirName);
async function run(){
    const baseBranch = core.getInput('base-branch');
    const targetBranch = core.getInput('target-branch')
    const ghToken = core.getInput('gh-token');
    const workingDir=core.getInput('working-directory');
    const debug =core.getInput('debug');

    core.setSecret(ghToken);
    if(!validateBranchName({branchName:baseBranch})){
        core.error('Invalid base branch Name Branch Name should incluede characters,numbers,hypens,dots,forwardslash')
        return;
    }
    if(!validateBranchName({branchName:targetBranch})){
        core.error('Invalid target branch Name Branch Name should incluede characters,numbers,hypens,dots,forwardslash')
        return;
    }
    
    if(!validateDirectoryName({dirName:workingDir})){
        core.error('Invalid working directory Name directory Name should incluede characters,numbers,hypens,dots,forwardslash') 
        return;
    }

    core.info(`[js-dependency-update]: Base branch is ${baseBranch}`);
    core.info(`[js-dependency-update] target branch is ${targetBranch}`);
    core.info(`[js-dependency-update] working directory is ${baseBranch}`);

   await exec.exec('npm update', [] ,{
       cwd:workingDir
   })

   const gitStatus = await exec.getExecOutput('git status -s package*.json',[],{
       cwd:workingDir
   })

   if(gitStatus.stdout.length>0){
       core.info('[js-dependency-update]: There are updates are  Avail;able')

   }else{
    core.info('[js-dependency-update]: There are updates are not  Avail;able')
   }


    /* 
     1.Parse inputs
       1.1 base branch from which to check for updates
       1.2 Target branch to use to create the Pr
       1.3 Github Token for authentication Pusposes
       1.4 Working directory for which to check for dependanci8es

     2.Execute the NPM update command witthion the working directory
     3. Check weather there are modified packages
     4. If there are modified files
       4.1 Add and Commit files to the target branch
       4.2 Create a PR ro the base branch using octokit api
       4.3 Otherwise conclude the Custom action

    */

}

run()
